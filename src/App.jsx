import { useState } from "react";
import "./App.css";
import StartScreen from "./components/StartPage";
import QuizPage from "./components/QuizPage";

function App() {
  const [currentScreen, setCurrentScreen] = useState("start-screen");

  let screen = <StartScreen onStart={() => setCurrentScreen("quiz")} />;

  // switch-case to be able to scale to higher number of pages
  switch (currentScreen) {
    case "quiz":
      screen = <QuizPage />;
  }

  return <>{screen}</>;
}

export default App;
