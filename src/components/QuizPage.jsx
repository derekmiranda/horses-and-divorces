import { useEffect, useState } from "react";
import { getCelebrities } from "../services/wikidataApi";
import PersonSection from "./PersonSection";
import ScorePopup from "./ScorePopup";


export default function QuizPage() {
  const [celebrities, setCelebrities] = useState([]);
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);


  async function fetchCelebrities() {
    const data = await getCelebrities();
    setCelebrities(() => {
      let celeb1, celeb2;
      do {
        const randomIndices = [];
        while (randomIndices.length < 2) {
          const randomIndex = Math.floor(Math.random() * data.length);
          if (!randomIndices.includes(randomIndex)) {
            randomIndices.push(randomIndex); // Ensure unique indices
          }
        }
        celeb1 = data[randomIndices[0]];
        celeb2 = data[randomIndices[1]];
      } while (celeb1.spouseCount === celeb2.spouseCount); // Ensure spouseCount is different
      return [celeb1, celeb2];
    });
    setHasAnswered(false);
  }

  useEffect(() => {
    fetchCelebrities(); // Fetch the initial set of celebrities
  }, []);


  if (!celebrities) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  const handleChoice = (chosenPerson) => {
    if (hasAnswered) return;

    const [person1, person2] = celebrities;
    const correctPerson = person1.spouseCount > person2.spouseCount ? person1 : person2;

    // Update the score if the player chose correctly
    if (chosenPerson.name === correctPerson.name) {
      setScore((prevScore) => prevScore + 1);
      setIsCorrect(true)
    } else {
      setIsCorrect(false)
    }
    setHasAnswered(true)
    setShowPopup(true)
  };

  const closePopup = () => {
    fetchCelebrities();
    setShowPopup(false); // Hide the popup
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
      {showPopup && <ScorePopup isCorrect={isCorrect} onClose={closePopup} celebrities={celebrities} />}
    </div>
  );
}