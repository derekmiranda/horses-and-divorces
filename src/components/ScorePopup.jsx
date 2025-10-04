import "./ScorePopup.css";

export default function ScorePopup({ isCorrect, onClose }) {
  return (
    <div className="popup" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isCorrect ? "Correct!" : "Wrong!"}</h2>
        <p>{isCorrect ? "You got it right!" : "Better luck next time!"}</p>
        <button onClick={onClose}>Continue</button>
      </div>
    </div>
  );
}
