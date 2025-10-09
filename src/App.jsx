import { useState, useEffect } from "react";
import "./App.css";
import StartScreen from "./components/StartPage";
import QuizPage from "./components/QuizPage";
import { getCelebrities } from "./services/wikidataApi";

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
  const [celebritiesData, setCelebritiesData] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15; // Random increment between 0-15
      if (progress > 90) progress = 90; // Cap at 90% until actually done
      setLoadingProgress(Math.min(progress, 90));
    }, 200);

    // Load both fonts and celebrity data in parallel
    Promise.all([
      preloadFonts(),
      getCelebrities()
    ]).then(([, celebrities]) => {
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setTimeout(() => {
        setFontsLoaded(true);
        setCelebritiesData(celebrities);
      }, 500); // Small delay to show 100%
    }).catch((error) => {
      console.error('Error loading app data:', error);
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setTimeout(() => {
        setFontsLoaded(true); // Still show the app even if data fails
      }, 500);
    });
  }, []);
  if (!fontsLoaded) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'monospace',
        whiteSpace: 'pre'
      }}>
        <span>{`
                _|\ _/|_,
             ,((\\''-\\\\_
           ,(())      '\\\
         ,(()))       ,_ \\
        ((())'   |        \\
        )))))     >.__     \\
        ((('     /    '__..c|
                         '_''
        `}</span>
        <div>Neigh Neigh</div>
        <div style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
          {Math.round(loadingProgress)}%
        </div>
      </div>
    );
  }

  let screen = <StartScreen onStart={() => setCurrentScreen("quiz")} />;

  // switch-case to be able to scale to higher number of pages
  switch (currentScreen) {
    case "quiz":
      screen = celebritiesData ? <QuizPage preloadedCelebrities={celebritiesData} onBackToStart={() => setCurrentScreen("start-screen")} /> : <div>Loading...</div>;
  }

  return <>{screen}</>;
}

export default App;
