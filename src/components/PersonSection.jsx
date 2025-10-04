import { useEffect, useState } from "react";
import { getCelebrities } from "../services/wikidataApi";

export default function PersonSection() {
  const [randomPerson, setRandomPerson] = useState(null);
  
  useEffect(() => {
    async function fetchRandomPerson() {
      try {
        const celebrities = await getCelebrities(); // Fetch the full celebrity list
        const randomIndex = Math.floor(Math.random() * celebrities.length); // Pick a random index
        setRandomPerson(celebrities[randomIndex]); // Set the random person
      } catch (error) {
        console.error("Error fetching celebrities:", error);
      }
    }

    fetchRandomPerson();
  }, []);

  if (!randomPerson) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  return (
    <div>
      <div className="person-img">
        <img
          src={randomPerson.image}
          alt={randomPerson.name}
          style={{ width: "150px", height: "auto" }}
        />
      </div>
      <button>{randomPerson.name}</button>
    </div>
  );
}