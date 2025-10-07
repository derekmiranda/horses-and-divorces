import "./GameOver.css";

export default function GameOver({ score, celebPairs, totalQuestions }) {
  const celebsSortedBySpouseNumber = celebPairs.reduce((accum, pair) => accum.concat(...pair), [])
    .filter((celeb, i, arr) => arr.findIndex(c => c.name === celeb.name) === i)
    .sort((c1, c2) => c2.spouseCount - c1.spouseCount)
  console.log('celebsSortedBySpouseNumber', celebsSortedBySpouseNumber)
  return (
    <div className="game-over-page">
      <div className="quiz-header non-animate">
        <h1>you guessed {score} out of {totalQuestions}!!</h1>
        <h4 className="game-over-subtitle">{endScreenCopy(score)}</h4>
      </div>
      <div className="spouse-list">
        <SpouseCountList celebs={celebsSortedBySpouseNumber} />
      </div>
    </div>
  )
}

function endScreenCopy(score) {
  switch (true) {
    case score >= 8 && score <= 10:
      return "Hollywood should fear you. You know everything.";
    case score >= 6 && score <= 9:
      return "You’ve clearly spent a healthy amount of time reading celebrity gossip";
    case score === 5:
      return "Half right, half wrong — just like most celebrity marriages.";
    case score >= 1 && score <= 4:
      return "Do you even read the tabloids?!";
    case score === 0:
      return "Wow. Are you living under a rock or just too pure for this world?";
    default:
      return "Invalid score. Did you sneak into the game without playing?";
  }
}

function SpouseCountList({ celebs }) {
  // Split celebrities into three columns
  const column1 = celebs.filter((_, i) => i % 3 === 0);
  const column2 = celebs.filter((_, i) => i % 3 === 1);
  const column3 = celebs.filter((_, i) => i % 3 === 2);

  return (
    <div className="celebrities-table">
      <div className="celebrities-column">
        {column1.map((celeb, i) => (
          <CelebrityRow key={i} celeb={celeb} />
        ))}
      </div>
      <div className="celebrities-column">
        {column2.map((celeb, i) => (
          <CelebrityRow key={i} celeb={celeb} />
        ))}
      </div>
      <div className="celebrities-column">
        {column3.map((celeb, i) => (
          <CelebrityRow key={i} celeb={celeb} />
        ))}
      </div>
    </div>
  );
}

function CelebrityRow({ celeb }) {
  return (
    <a href={celeb.wikiUrl} className="spouse-row-link" target="_blank" rel="noreferrer">
      <div className="spouse-count-row">
        <div className="game-over-person-image-container">
          <img src={celeb.image} alt={celeb.name} className="person-image" />
        </div>
        <div className="celeb-info">
          <p className="spouse-name">{celeb.name}</p>
          <p className="spouse-count">{celeb.spouseCount}</p>
        </div>
      </div>
    </a>
  );
}
