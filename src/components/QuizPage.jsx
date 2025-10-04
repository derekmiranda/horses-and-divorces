import { useEffect, useState } from "react";
import { getCelebrities } from "../services/wikidataApi";
import PersonSection from "./PersonSection";

export default function QuizPage() {
  const [celebrities, setCelebrities] = useState([]);
  const [score, setScore] = useState(0);

  async function fetchCelebrities() {
    const data = await getCelebrities();
    setCelebrities(() => {
      const randomIndices = [];
      while (randomIndices.length < 2) {
        const randomIndex = Math.floor(Math.random() * data.length);
        if (!randomIndices.includes(randomIndex)) {
          randomIndices.push(randomIndex); // Ensure unique indices
        }
      }
      return [data[randomIndices[0]], data[randomIndices[1]]]; // Pick two random celebrities
    });
  }

  useEffect(() => {
    fetchCelebrities(); // Fetch the initial set of celebrities
  }, []);


  if (!celebrities) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  const handleChoice = (chosenPerson) => {
    // Determine the correct person (the one with more spouses)
    const [person1, person2] = celebrities;
    const correctPerson = person1.spouseCount > person2.spouseCount ? person1 : person2;

    // Update the score if the player chose correctly
    if (chosenPerson.name === correctPerson.name) {
      setScore((prevScore) => prevScore + 1);
    }
    fetchCelebrities();
  };

  if (celebrities.length < 2) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Horses and Divorces / Wiki-Exes</h1>
      <p>Score: {score}</p>
      <section className="quiz-row">
        <PersonSection person={celebrities[0]} onChoose={handleChoice} />
        <p>Who has the most divorces?</p>
        <PersonSection person={celebrities[1]} onChoose={handleChoice} />
      </section>
    </div>
  );
}