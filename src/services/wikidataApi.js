async function fetchCelebritiesFromWikidata() {
  const endpoint = "https://query.wikidata.org/sparql";
  const query = `
    SELECT DISTINCT ?person ?image (COUNT(?spouse) AS ?spouseCount) ?dob WHERE {
      ?person wdt:P26 ?spouse.
      ?person wdt:P18 ?image.
      ?person wdt:P569 ?dob.
      FILTER(?dob >  "+1901-00-00T00:00:00Z"^^xsd:dateTime)
    }
    GROUP BY ?person ?image ?dob
    HAVING (COUNT(?spouse) >= 2)
    ORDER BY RAND()
    LIMIT 100
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

// Calculate adjusted spouse count based on specific rules
function calculateAdjustedSpouseCount(originalCount) {
  if (originalCount === 6) {
    return originalCount / 3; // 6 becomes 2
  } else if (originalCount === 8) {
    return originalCount / 2; // 8 becomes 4
  } else if (originalCount === 9) {
    return originalCount / 3; // 9 becomes 3
  } else if (originalCount >= 10) {
    return originalCount / 2; // 10+ becomes 5+
  }
  return originalCount; // Keep original for other counts
}

// Process the celebrity data from Wikidata SPARQL query
export async function getCelebrities() {
  const sparqlData = await fetchCelebritiesFromWikidata();

  return Promise.all(
    sparqlData.results.bindings.map(async (entry) => {
      const qid = entry.person.value.split("/").pop();
      const { name, description } = await fetchEntityData(qid);
      const originalSpouseCount = Number(entry.spouseCount.value);
      const adjustedSpouseCount = calculateAdjustedSpouseCount(originalSpouseCount);

      return {
        name,
        description,
        uri: entry.person.value,
        image: getCompressedImageUrl(entry.image.value, 300),
        spouseCount: adjustedSpouseCount,
        originalSpouseCount: originalSpouseCount, // Keep original for reference
        wikiUrl: `https://en.wikipedia.org/wiki/${name.replace(/\s+/g, '_')}`,
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
