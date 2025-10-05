import { useEffect, useState } from "react";
import { getCelebrities } from "../services/wikidataApi";
import ScorePopup from "./ScorePopup";

const NUM_QUESTIONS = 10;

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

  return randomIndices.map((i) => allCelebs[i]);
}

export default function QuizPage() {
  const [allCelebrities, setAllCelebrities] = useState([]);
  const [celebPairs, setCelebPairs] = useState([]);
  const [currPairIdx, setCurrPairIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const celebrities = celebPairs[currPairIdx] || [];

  const prepNextQuestion = () => {
    setCurrPairIdx((i) => i + 1);
    setHasAnswered(false);
  };

  async function fetchCelebrities() {
    const data = await getCelebrities();
    setAllCelebrities(data);
    return data;
  }

  function resetState(allCelebrities) {
    const celebPairs = [];
    for (let i = 0; i < NUM_QUESTIONS; i++) {
      celebPairs.push(getRandomCelebs(allCelebrities));
    }
    setCelebPairs(celebPairs);
    setShowPopup(false);
    setIsCorrect(false);
    setHasAnswered(false);
    setCurrPairIdx(0);
    setScore(0);
  }

  async function init() {
    const data = await fetchCelebrities();
    resetState(data);

    // preload imgs
    celebPairs.forEach((pair) => {
      pair.forEach((celeb) => {
        const img = new Image();
        img.src = celeb.image;
      });
    });
  }

  useEffect(() => {
    init(); // Fetch the initial set of celebrities
  }, []);

  const handleChoice = (idx) => {
    if (hasAnswered) return;

    const [person1, person2] = celebrities;
    const correctIdx = person1.spouseCount > person2.spouseCount ? 0 : 1;

    // Update the score if the player chose correctly
    if (idx === correctIdx) {
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

  if (currPairIdx >= NUM_QUESTIONS) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>
            you guessed {score} out of {NUM_QUESTIONS}!!
          </h1>
          <button onClick={() => resetState(allCelebrities)}>
            Play Again?
          </button>
        </div>
      </div>
    );
  } else if (!celebrities.length) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>who had more spouses?</h1>
        <p className="score">
          {" "}
          your score: {score} / {NUM_QUESTIONS}
        </p>
        <p className="score"> # {currPairIdx + 1}</p>
      </div>
      <div className="quiz-split">
        {celebrities.map((celeb, i) => (
          <PersonSection
            handleClick={() => handleChoice(i)}
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
