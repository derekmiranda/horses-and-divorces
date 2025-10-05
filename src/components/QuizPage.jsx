import { useEffect, useState } from "react";
import { getCelebrities } from "../services/wikidataApi";
import ScorePopup from "./ScorePopup";

function PersonSection({ handleClick, imgSrc, name, description }) {
  return (
    <div className="person-section" onClick={handleClick}>
      <div className="person-image-container">
        <img src={imgSrc} alt={name} className="person-image" />
        <div className="person-name-overlay">
          <span className="person-name">{name}</span>
          <p>{description}</p>
        </div>
      </div>{" "}
    </div>
  );
}

function getRandomCelebs(allCelebs) {
  const randomIndices = [];
  const mapCelebs = () => randomIndices.map((i) => allCelebs[i]);

  while (randomIndices.length < 2 && allCelebs.length >= 2) {
    let randomIndex = Math.floor(Math.random() * allCelebs.length);
    if (!randomIndices.includes(randomIndex)) {
      // ensure no ties
      while (
        randomIndices.length &&
        allCelebs[randomIndices[0]].spouseCount ===
          allCelebs[randomIndex].spouseCount
      ) {
        randomIndex = (randomIndex + 1) % allCelebs.length;
      }
      randomIndices.push(randomIndex); // Ensure unique indices
    }
  }

  return mapCelebs();
}

export default function QuizPage() {
  const [allCelebrities, setAllCelebrities] = useState([]);
  const [celebrities, setCelebrities] = useState([]);
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const prepNextQuestion = () => {
    setCelebrities(() => {
      return getRandomCelebs(allCelebrities);
    });
    setHasAnswered(false);
  };

  async function fetchCelebrities() {
    const data = await getCelebrities();
    setAllCelebrities(data);
    return data;
  }

  async function init() {
    const data = await fetchCelebrities();
    setCelebrities(getRandomCelebs(data));
  }

  useEffect(() => {
    init(); // Fetch the initial set of celebrities
  }, []);

  const handleChoice = (chosenPerson) => {
    if (hasAnswered) return;

    const [person1, person2] = celebrities;
    const correctPerson =
      person1.spouseCount > person2.spouseCount ? person1 : person2;

    // Update the score if the player chose correctly
    if (chosenPerson.name === correctPerson.name) {
      setScore((prevScore) => prevScore + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setHasAnswered(true);
    setShowPopup(true);
  };

  const closePopup = () => {
    prepNextQuestion();
    setShowPopup(false); // Hide the popup
  };

  if (!celebrities.length) {
    return <div>Loading...</div>; // Show loading state while fetching
  }
  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>who had more spouses?</h1>
        <p className="score"> your score: {score} / 10</p>
      </div>
      <div className="quiz-split">
        {celebrities.map((celeb) => (
          <PersonSection
            handleClick={() => handleChoice(celeb)}
            imgSrc={celeb.image}
            name={celeb.name}
            description={celeb.description}
            key={celeb.name}
          />
        ))}
      </div>
      <ScorePopup
        visible={showPopup}
        isCorrect={isCorrect}
        onClose={closePopup}
        celebrities={celebrities}
      />
    </div>
  );
}
