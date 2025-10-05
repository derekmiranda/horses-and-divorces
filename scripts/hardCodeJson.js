import fetch from 'node-fetch'
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`attempt #${attempt + 1}...`)
      const res = await fetch(url, options);
      console.log('success!')
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

async function fetchInitialPersonList() {
  try {
    const endpoint = "https://query.wikidata.org/sparql";
    const query = `
      SELECT DISTINCT ?person ?image (COUNT(?spouse) AS ?spouseCount) ?dob WHERE {
        ?person wdt:P26 ?spouse.
        ?person wdt:P18 ?image.
        ?person wdt:P569 ?dob.
        FILTER(?dob >  "+1901-00-00T00:00:00Z"^^xsd:dateTime)
      }
      GROUP BY ?person ?image ?dob
      ORDER BY RAND()
      LIMIT 50
    `.trim();
    const url = endpoint + "?query=" + encodeURIComponent(query);
    const headers = { Accept: "application/sparql-results+json" };
    const res = await fetchWithRetry(url, { headers, signal: AbortSignal.timeout(5000) }, 3, 2000);
    console.log('res.status', res.status)
    const text = await res.text();
    return text && JSON.parse(text);
  } catch (err) {
    console.log('initial person fetch error', err)
  }
}

// add in celebs when you are ready to change the dataset call
export async function getCelebrities() {
  const data = await fetchInitialPersonList()
  console.log('data', data)

  if (!data) {
    return []
  }

  return Promise.all(
    data.results.bindings.map(async (entry) => {
      const qid = entry.person.value.split("/").pop();
      const { name, description } = await fetchEntityData(qid);

      return {
        name,
        description,
        uri: entry.person.value,
        image: entry.image.value,
        spouseCount: Number(entry.spouseCount.value),
      };
    })
  );
}

async function fetchEntityData(qid) {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const res = await fetch(url).catch(err => {
    // ignore error and return blank object
    return {}
  })
  const data = await res.json();

  const entity = data?.entities?.[qid];
  const name = entity?.labels?.en?.value || "No name available";
  const description =
    entity?.descriptions?.en?.value || "No description available";

  return { name, description };
}

(async function () {
  const celebs = await getCelebrities()
  if (!celebs) {
    console.log('no celebs data retrieved');
    return;
  }

  await writeFile(
    resolve(import.meta.dirname, '../src/assets/Celebs.json'),
    JSON.stringify(celebs, null, 2),
    'utf8'
  );
  console.log('Celebrities data written to assets/Celebs.json');
})()