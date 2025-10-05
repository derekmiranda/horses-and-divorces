export default function GameOver({ score }) {
  return <>
    {endScreenCopy(score)}
  </>
}

function endScreenCopy(score){
  switch (true) {
    case score === 10:
      return "Hollywood should fear you. You know everything.";
    case score >= 7 && score <= 9:
      return "You’ve clearly spent a healthy amount of time reading celebrity gossip";
    case score === 5 || score === 6:
      return "Half right, half wrong — just like most celebrity marriages.";
    case score >= 1 && score <= 4:
      return "Do you even read the tabloids?!";
    case score === 0:
      return "Wow. Are you living under a rock or just too pure for this world?";
    default:
      return "Invalid score. Did you sneak into the game without playing?";
  }
}