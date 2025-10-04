export async function getCelebrities() {
  const endpoint = "https://query.wikidata.org/sparql";
  const query = `
    SELECT ?person ?image (COUNT(?spouse) AS ?spouseCount) WHERE {
      ?person wdt:P26 ?spouse.
      ?person wdt:P18 ?image.
    }
    GROUP BY ?person ?image
    ORDER BY RAND()
    LIMIT 50
  `;
  const url = endpoint + "?query=" + encodeURIComponent(query);
  const headers = { "Accept": "application/sparql-results+json" };
  const res = await fetch(url, { headers });
  const data = await res.json();

  return data.results.bindings.map(entry => ({
    name: fetchName(entry.person.value.split('/').pop()),
    uri: entry.person.value,
    image: entry.image.value,
    spouseCount: Number(entry.spouseCount.value),
  }));
}

async function fetchName(qid) {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const res = await fetch(url);
  const data = await res.json();

  return data.entities[qid].labels.en.value;
}
