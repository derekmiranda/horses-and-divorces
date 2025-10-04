import useCountdown from "../hooks/useCountdown";

export default function Timer() {
    const { secondsLeft, isRunning, pause, start, reset } = useCountdown(30, {
    autoStart: false,
    onExpire: () => console.log("time's up"),
  });

  return (
    <>
     <div className="timer">{secondsLeft}s</div>
          <div className="timer-controls">
            {isRunning ? (
              <button onClick={pause}>Pause</button>
            ) : (
              <button onClick={start}>Start</button>
            )}
            <button onClick={() => reset(30)}>Reset</button>
          </div>
    </>
  )
}