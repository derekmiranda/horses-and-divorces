import "./QuizPage.css"
import "./StartPage.css"


function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1>horses and divorces</h1>
      <p>guess which public figure has more divorces 👀</p>
      
      <button onClick={onStart}>start</button>
    </div>
  )
}

export default StartScreen
