import "./QuizPage.css"
import "./StartPage.css"

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1 className="animate">horses & divorces*</h1>
      <h4>Think you know your celebrities? <br></br> Or how many spouses they've had? 👀</h4>
      <button onClick={onStart}>Start Guessing</button>
      <p className="disclaimer">*Horses and divorces refers to situations in a divorce where legal and emotional complications arise from a couple's ownership of a horse, including its status as marital property, the financial costs of care, who gets custody of the animal, and the emotional bond between the horse and the owners.</p>
    </div>
  )
}

export default StartScreen
