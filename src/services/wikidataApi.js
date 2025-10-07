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

// Convert Wikimedia Commons image URL to thumbnail with fixed width
function getCompressedImageUrl(imageUrl, width = 300) {
  if (!imageUrl) return null;

  // Extract filename from URL
  const filename = imageUrl.split('/').pop();
  if (!filename) return imageUrl;

  // Create thumbnail URL with fixed width for consistent sizing
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${width}`;
}

// Process the celebrity data from the JSON file
export async function getCelebrities() {
  return jsonData.map((celeb) => ({
    name: celeb.name,
    description: celeb.description,
    uri: celeb.uri,
    image: getCompressedImageUrl(celeb.image, 300),
    spouseCount: celeb.spouseCount,
    wikiUrl: celeb.wikiUrl,
  }));
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
