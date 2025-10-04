import { useEffect, useState } from "react";
import "./QuizPage.css"
import useCountdown from "../hooks/useCountdown";
import { getCelebrities } from "../services/wikidataApi";

function PersonSection({ children }) {
  return (
    <div>
      <div className="person-img"></div>
      <button>{children}</button>
    </div>
  )
}

async function testGetCelebrities() {
  try {
    const data = await getCelebrities();
    console.log("Fetched data:", data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

testGetCelebrities();

function QuizPage() {
  const { secondsLeft, isRunning, pause, start, reset } = useCountdown(30, {
    autoStart: false,
    onExpire: () => console.log("time's up"),
  });
  
  const [celebrities, setCelebrities] = useState([]);

  useEffect(() => {
    getCelebrities().then(setCelebrities);
  }, []);

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
