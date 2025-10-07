import { useState, useEffect } from "react";
import "./App.css";
import StartScreen from "./components/StartPage";
import QuizPage from "./components/QuizPage";

// Font preloading function
function preloadFonts() {
  const fontFamilies = [
    'Redaction',
    'Redaction 10',
    'Redaction 20',
    'Redaction 35',
    'Redaction 50',
    'Redaction 70',
    'Redaction 100'
  ];

  const fontPromises = fontFamilies.map(family => {
    return new Promise((resolve) => {
      if (document.fonts && document.fonts.check) {
        // Modern browsers with Font Loading API
        document.fonts.load(`16px "${family}"`).then(() => {
          resolve();
        }).catch(() => {
          // Fallback: wait a bit then resolve
          setTimeout(resolve, 100);
        });
      } else {
        // Fallback for older browsers
        setTimeout(resolve, 200);
      }
    });
  });

  return Promise.all(fontPromises);
}

function App() {
  const [currentScreen, setCurrentScreen] = useState("start-screen");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    preloadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

  if (!fontsLoaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Loading...
      </div>
    );
  }

  let screen = <StartScreen onStart={() => setCurrentScreen("quiz")} />;

  // switch-case to be able to scale to higher number of pages
  switch (currentScreen) {
    case "quiz":
      screen = <QuizPage />;
  }

  return <>{screen}</>;
}

export default App;
