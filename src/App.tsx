import { useState, useEffect, useRef } from 'react';
import './App.css';
import Settings from './Settings';

function App() {
  const [initialMinutes, setInitialMinutes] = useState(() => {
    const savedMinutes = localStorage.getItem('initialMinutes');
    return savedMinutes ? parseInt(savedMinutes, 10) : 5;
  });
  const [initialSeconds, setInitialSeconds] = useState(() => {
    const savedSeconds = localStorage.getItem('initialSeconds');
    return savedSeconds ? parseInt(savedSeconds, 10) : 0;
  });
  const [startSoundMinutes, setStartSoundMinutes] = useState(() => {
    const savedStartSoundMinutes = localStorage.getItem('startSoundMinutes');
    return savedStartSoundMinutes ? parseInt(savedStartSoundMinutes, 10) : 5;
  });
  const [startSoundSeconds, setStartSoundSeconds] = useState(() => {
    const savedStartSoundSeconds = localStorage.getItem('startSoundSeconds');
    return savedStartSoundSeconds ? parseInt(savedStartSoundSeconds, 10) : 0;
  });
  const [remindMinutes, setRemindMinutes] = useState(() => {
    const savedRemindMinutes = localStorage.getItem('remindMinutes');
    return savedRemindMinutes ? parseInt(savedRemindMinutes, 10) : 1;
  });
  const [remindSeconds, setRemindSeconds] = useState(() => {
    const savedRemindSeconds = localStorage.getItem('remindSeconds');
    return savedRemindSeconds ? parseInt(savedRemindSeconds, 10) : 0;
  });

  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [characterActive, setCharacterActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const startAudioRef = useRef<HTMLAudioElement>(null);
  const endAudioRef = useRef<HTMLAudioElement>(null);
  const remindAudioRef = useRef<HTMLAudioElement>(null);

  const totalInitialSeconds = initialMinutes * 60 + initialSeconds;
  const startSoundTotalSeconds = startSoundMinutes * 60 + startSoundSeconds;
  const remindSoundTotalSeconds = remindMinutes * 60 + remindSeconds;

  useEffect(() => {
    let interval: number | undefined = undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        const totalSeconds = minutes * 60 + seconds;
        if (totalSeconds > 0) {
          const newTotalSeconds = totalSeconds - 1;
          setMinutes(Math.floor(newTotalSeconds / 60));
          setSeconds(newTotalSeconds % 60);

          if (newTotalSeconds === startSoundTotalSeconds) {
            startAudioRef.current?.play();
            setCharacterActive(true); // キャラクターをアクティブにする
          }
          if (newTotalSeconds === remindSoundTotalSeconds) {
            remindAudioRef.current?.play();
          }
          if (newTotalSeconds === 0) {
            endAudioRef.current?.play();
            setIsActive(false); // タイマーが0になった瞬間にisActiveをfalseにする
            setCharacterActive(false); // キャラクターを非アクティブにする
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
    setCharacterActive(false); // キャラクターをリセットする
  };

  return (
    <div className="App">
      <div className="timer-display">
        {minutes === 0 && seconds === 0 ? (
          <span style={{ color: 'red' }}>Time is up</span>
        ) : (
          <>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            <div className={`character-container ${characterActive ? 'active' : ''}`}>
              <div className="loading-dots"></div>
            </div>
          </>
        )}
      </div>

      <div>
        {!isActive ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <button onClick={handleStop}>Stop</button>
        )}
        <button onClick={handleReset}>Reset</button>
        <button onClick={() => setShowSettings(true)}>⚙️</button>
      </div>

      <audio ref={startAudioRef} src={import.meta.env.BASE_URL + "start.mp3"} preload="auto"></audio>
      <audio ref={endAudioRef} src={import.meta.env.BASE_URL + "end.mp3"} preload="auto"></audio>
      <audio ref={remindAudioRef} src={import.meta.env.BASE_URL + "remind.mp3"} preload="auto"></audio>

      {showSettings && (
        <Settings
          initialMinutes={initialMinutes}
          setInitialMinutes={setInitialMinutes}
          initialSeconds={initialSeconds}
          setInitialSeconds={setInitialSeconds}
          startSoundMinutes={startSoundMinutes}
          setStartSoundMinutes={setStartSoundMinutes}
          startSoundSeconds={startSoundSeconds}
          setStartSoundSeconds={setStartSoundSeconds}
          remindMinutes={remindMinutes}
          setRemindMinutes={setRemindMinutes}
          remindSeconds={remindSeconds}
          setRemindSeconds={setRemindSeconds}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
