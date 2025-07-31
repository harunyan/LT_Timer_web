import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [initialMinutes, setInitialMinutes] = useState(5);
  const [initialSeconds, setInitialSeconds] = useState(0);
  const [startSoundMinutes, setStartSoundMinutes] = useState(5);
  const [startSoundSeconds, setStartSoundSeconds] = useState(0);

  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  const startAudioRef = useRef<HTMLAudioElement>(null);
  const endAudioRef = useRef<HTMLAudioElement>(null);

  const totalInitialSeconds = initialMinutes * 60 + initialSeconds;
  const startSoundTotalSeconds = startSoundMinutes * 60 + startSoundSeconds;

  useEffect(() => {
    let interval: number | undefined = undefined;

    if (isActive) {
      interval = setInterval(() => {
        const totalSeconds = minutes * 60 + seconds;
        if (totalSeconds > 0) {
          const newTotalSeconds = totalSeconds - 1;
          setMinutes(Math.floor(newTotalSeconds / 60));
          setSeconds(newTotalSeconds % 60);

          if (newTotalSeconds === startSoundTotalSeconds) {
            startAudioRef.current?.play();
          }
          if (newTotalSeconds === 0) {
            endAudioRef.current?.play();
            setIsActive(false); // タイマーが0になった瞬間にisActiveをfalseにする
          }
        } else {
          setIsActive(false);
        }
      }, 1000);
    } else if (!isActive && (minutes !== 0 || seconds !== 0)) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, startSoundTotalSeconds, initialMinutes, initialSeconds]);

  const handleStart = () => {
    if (isActive) {
      return; // Already active, do nothing
    }

    // If the timer is at its initial state OR if it has reached 0, start from initial time
    if ((minutes === initialMinutes && seconds === initialSeconds) || (minutes === 0 && seconds === 0)) {
      setMinutes(initialMinutes);
      setSeconds(initialSeconds);
      setIsActive(true);
      // Play start sound immediately if initial time is also the start sound time
      if (totalInitialSeconds === startSoundTotalSeconds) {
        startAudioRef.current?.play();
      }
    } else {
      // If the timer is paused at a non-initial, non-zero time, resume from current time
      setIsActive(true);
    }
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
  };

  return (
    <div className="App">
      <div className="timer-display">
        {minutes === 0 && seconds === 0 ? (
          <span style={{ color: 'red' }}>Time is up</span>
        ) : (
          <>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </>
        )}
      </div>

      <div className="controls">
        <div className="control-group">
          <label>Start Time:</label>
          <input
            type="number"
            value={initialMinutes}
            onChange={(e) => setInitialMinutes(parseInt(e.target.value, 10))}
            min="0"
          />
          <span>min</span>
          <input
            type="number"
            value={initialSeconds}
            onChange={(e) => setInitialSeconds(parseInt(e.target.value, 10))}
            min="0"
            max="59"
          />
          <span>sec</span>
        </div>
        <div className="control-group">
          <label>Play Start Sound at:</label>
          <input
            type="number"
            value={startSoundMinutes}
            onChange={(e) => setStartSoundMinutes(parseInt(e.target.value, 10))}
            min="0"
          />
          <span>min</span>
          <input
            type="number"
            value={startSoundSeconds}
            onChange={(e) => setStartSoundSeconds(parseInt(e.target.value, 10))}
            min="0"
            max="59"
          />
          <span>sec</span>
        </div>
      </div>

      <div>
        {!isActive ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <button onClick={handleStop}>Stop</button>
        )}
        <button onClick={handleReset}>Reset</button>
      </div>

      <audio ref={startAudioRef} src="start.mp3" preload="auto"></audio>
      <audio ref={endAudioRef} src="end.mp3" preload="auto"></audio>
    </div>
  );
}

export default App;
