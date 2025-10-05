import './GameOver.css'

export default function GameOver({ score, celebPairs }) {
  const celebsSortedBySpouseNumber = celebPairs.reduce((accum, pair) => accum.concat(...pair), [])
    .filter((celeb, i, arr) => arr.findIndex(c => c.name === celeb.name) === i)
    .sort((c1, c2) => c2.spouseCount - c1.spouseCount)
  return <>
      <div className="quiz-container">
      <div className="quiz-header">
        <h1>
          you guessed {score} out of {num_questions}!!
        </h1>
        <h4>{endScreenCopy(score)}</h4>
    <SpouseCountList celebs={celebsSortedBySpouseNumber} />
      </div>
    </div>
  </>
}

function endScreenCopy(score){
  switch (true) {
    case score === 10:
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
  return celebs.map(celeb => (
    <div key={celeb.name} className="spouse-count-row">
      <div className="game-over-person-image-container">
        <img src={celeb.image} alt={celeb.name} className="person-image" />
      </div>
      <p>{celeb.name}</p>
      <p>{celeb.spouseCount}</p>
    </div>
  ))
}
