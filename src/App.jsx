import { useState } from 'react'
import './App.css'
import StartScreen from './components/StartPage'
import QuizPage from './components/QuizPage'

function App() {
  const [currentScreen, setCurrentScreen] = useState('quiz')

  let screen = <StartScreen /> 
  switch (currentScreen) {
    case 'quiz':
      screen = <QuizPage />
  }

  return (
    <>
      {screen}
    </>
  )
}

export default App
