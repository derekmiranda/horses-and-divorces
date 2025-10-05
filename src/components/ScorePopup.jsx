import "./ScorePopup.css";

function addSPerhaps(n) {
  return n === 1 ? "" : "s";
}

export default function ScorePopup({
  isCorrect,
  onClose,
  celebrities,
  visible,
}) {
  if (!celebrities.length) return null;

  let ppClassName = "popup";
  if (!visible) {
    ppClassName += " popup--hide";
  }

  return (
    <div className={ppClassName} onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3>{isCorrect ? "✅ CORRECT ✅" : "❌ WRONG ❌"}</h3>
        <p>
          {celebrities[0].name} had {celebrities[0].spouseCount} spouse
          {addSPerhaps(celebrities[0].spouseCount)} and <br />
          {celebrities[1].name} had {celebrities[1].spouseCount} spouse
          {addSPerhaps(celebrities[1].spouseCount)}
        </p>
        <button onClick={onClose}>Next Round</button>
      </div>
    </div>
  );
}
