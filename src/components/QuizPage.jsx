import "./QuizPage.css"
import useCountdown from "../hooks/useCountdown";

function PersonSection({ children }) {
  return (
    <div>
      <div className="person-img"></div>
      <button>{children}</button>
    </div>
  )
}

function QuizPage() {
  const { secondsLeft, isRunning, pause, start, reset } = useCountdown(30, {
    autoStart: false,
    onExpire: () => console.log("time's up"),
  });

  return (
    <>
      <h1>horses and divorces / wiki-exes</h1>
        <div className="timer-row">
          <div className="timer">{secondsLeft}s</div>
          <div className="timer-controls">
            {isRunning ? (
              <button onClick={pause}>Pause</button>
            ) : (
              <button onClick={start}>Start</button>
            )}
            <button onClick={() => reset(30)}>Reset</button>
          </div>
        </div>

      <section className="quiz-row">
        <PersonSection>this one?</PersonSection>
        <p>who has the most divorces?</p>
        <PersonSection>or this one?</PersonSection>
      </section>
    </>
  )
}

export default QuizPage
