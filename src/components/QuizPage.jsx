import { useEffect, useState } from "react";
import allCelebrities from '../assets/Celebs.json'
import ScorePopup from "./ScorePopup";
import GameOver from "./GameOver";

const NUM_QUESTIONS = 10;

function PersonSection({ handleClick, imgSrc, name, description }) {
  return (
    <div className="person-section" onClick={handleClick}>
      <div className="person-name-static">{name}</div>
      <div className="person-image-container">
        <img src={imgSrc} alt={name} className="person-image" />
        <div className="person-name-overlay">
          <p>{description}</p>
        </div>
      </div>
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
        randomIndices.length && ((
          allCelebs[randomIndices[0]].spouseCount ===
          allCelebs[randomIndex].spouseCount
        ) || randomIndex === randomIndices[0])
      ) {
        randomIndex = Math.floor(Math.random() * allCelebs.length);
      }
      randomIndices.push(randomIndex); // Ensure unique indices
    }
  }

  // randomize swapping celebs
  if (Math.random() > 0.5) {
    let temp = randomIndices[0]
    randomIndices[0] = randomIndices[1]
    randomIndices[1] = temp
  }

  return randomIndices.map((i) => allCelebs[i]);
}

export default function QuizPage() {
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
    resetState(allCelebrities);

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
          <GameOver score={score} celebPairs={celebPairs} totalQuestions={NUM_QUESTIONS} />
        </div>
        <div>
          <button onClick={() => resetState(allCelebrities)}>
            Play Again?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-status">
        <span className="score">your score: {score} / {NUM_QUESTIONS}</span>
        <span className="progress">Round {currPairIdx + 1}</span>
      </div>
      <div className="celeb-container">
        <div className="quiz-header">
          <h2>who had more spouses?</h2>
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
    </div>
  );
}
