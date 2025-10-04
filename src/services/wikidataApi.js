export async function getCelebrities() {
  const endpoint = "https://query.wikidata.org/sparql";
  const query = `
    SELECT ?person ?personLabel (COUNT(?spouse) AS ?spouseCount) WHERE {
      ?person wdt:P106 ?occupation.
      ?person wdt:P26 ?spouse.
      FILTER(?occupation IN (wd:Q33999, wd:Q3282637, wd:Q2405480, wd:Q947873))
    }
    GROUP BY ?person ?personLabel
    ORDER BY DESC(?spouseCount)
    LIMIT 10
  `;
  const url = endpoint + "?query=" + encodeURIComponent(query);
  const headers = { "Accept": "application/sparql-results+json" };
  const res = await fetch(url, { headers });
  const data = await res.json();
  return data.results.bindings.map(entry => ({
    name: entry.personLabel.value,
    spouseCount: Number(entry.spouseCount.value),
  }));
}
