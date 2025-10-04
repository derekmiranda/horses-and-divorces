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

  return Promise.all(
    data.results.bindings.map(async (entry) => {
      const qid = entry.person.value.split('/').pop();
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
  const description = entity.descriptions?.en?.value || "No description available";

  return { name, description };
}