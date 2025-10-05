import jsonData from "../assets/Celebs.json";

async function fetchInitialPersonList() {
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
  `;
  const url = endpoint + "?query=" + encodeURIComponent(query);
  const headers = { Accept: "application/sparql-results+json" };
  const res = await fetch(url, { headers });
  return await res.json();
}

// add in celebs when you are ready to change the dataset call
export async function getCelebrities() {
  return Promise.all(
    jsonData.results.bindings.map(async (entry) => {
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
  const res = await fetch(url);
  const data = await res.json();

  const entity = data.entities[qid];
  const name = entity.labels?.en?.value || "No name available";
  const description =
    entity.descriptions?.en?.value || "No description available";

  return { name, description };
}
