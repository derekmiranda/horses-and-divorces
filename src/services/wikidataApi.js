export async function getCelebrities() {
  const endpoint = "https://query.wikidata.org/sparql";
  const query = `
    SELECT ?person ?personLabel ?image (COUNT(?spouse) AS ?spouseCount) WHERE {
      ?person wdt:P106 ?occupation.
      ?person wdt:P26 ?spouse.
      ?person wdt:P18 ?image.  # Ensure the person has an image
      FILTER(?occupation IN (wd:Q33999, wd:Q3282637, wd:Q2405480, wd:Q947873))
    }
    GROUP BY ?person ?personLabel ?image
    ORDER BY RAND()
    LIMIT 2
  `;
  const url = endpoint + "?query=" + encodeURIComponent(query);
  const headers = { "Accept": "application/sparql-results+json" };
  const res = await fetch(url, { headers });
  const data = await res.json();

  return data.results.bindings.map(entry => ({
    name: entry.personLabel.value,
    image: entry.image.value,
    spouseCount: Number(entry.spouseCount.value),
  }));
}
