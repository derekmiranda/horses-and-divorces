import "./ScorePopup.css";

export default function ScorePopup({
  isCorrect,
  onClose,
  celebrities,
  visible,
}) {
  let ppClassName = "popup";
  if (!visible) {
    ppClassName += " popup--hide";
  }

  return (
    <div className={ppClassName} onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isCorrect ? "✅Correct!" : "❌ Wrong"}</h2>
        <p>
          {celebrities[0].name} had {celebrities[0].spouseCount} spouse(s) and{" "}
          <br />
          {celebrities[1].name} had {celebrities[1].spouseCount} spouse(s)
        </p>
        <button onClick={onClose}>Next Round</button>
      </div>
    </div>
  );
}
