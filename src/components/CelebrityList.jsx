import { useEffect, useState } from "react";
import { getCelebrities } from "./services/wikidataApi";

function CelebrityList() {
  const [celebrities, setCelebrities] = useState([]);

  useEffect(() => {
    getCelebrities().then(setCelebrities);
  }, []);

  return (
    <ul>
      {celebrities.map((c, i) => (
        <li key={i}>{c.name} — {c.spouseCount}</li>
      ))}
    </ul>
  );
}

export default CelebrityList;
