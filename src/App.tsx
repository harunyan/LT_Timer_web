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
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const startAudioRef = useRef<HTMLAudioElement>(null);
  const endAudioRef = useRef<HTMLAudioElement>(null);
  const remindAudioRef = useRef<HTMLAudioElement>(null);

  const totalInitialSeconds = initialMinutes * 60 + initialSeconds;
  const startSoundTotalSeconds = startSoundMinutes * 60 + startSoundSeconds;
  const remindSoundTotalSeconds = remindMinutes * 60 + remindSeconds;

  useEffect(() => {
    const fetchTranslations = async () => {
      const enTranslations = await fetch(import.meta.env.BASE_URL + 'locales/en.json').then(res => res.json());
      if (language === 'en') {
        setTranslations(enTranslations);
      } else {
        const langTranslations = await fetch(import.meta.env.BASE_URL + `locales/${language}.json`).then(res => res.json()).catch(() => ({}));
        setTranslations({ ...enTranslations, ...langTranslations });
      }
    };
    fetchTranslations();
  }, [language]);

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
      return; // すでにアクティブな場合は何もしない
    }

    // タイマーが初期状態または0に達した場合、初期時間から開始します
    if ((minutes === initialMinutes && seconds === initialSeconds) || (minutes === 0 && seconds === 0)) {
      setMinutes(initialMinutes);
      setSeconds(initialSeconds);
      setIsActive(true);
      // 初期時間と開始音の時間が同じ場合は、すぐに開始音を再生します
      if (totalInitialSeconds === startSoundTotalSeconds) {
        startAudioRef.current?.play();
      }
    } else {
      // タイマーが初期状態でも0でもない一時停止中の場合、現在の時間から再開します
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
          <span className="time-is-up" style={{ color: 'red' }}>{translations.timeIsUp || 'Time is up'}</span>
        ) : (
          <>
            {`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`.split('').map((char, index) => (
              <span key={index} className="digit">{char}</span>
            ))}
            <div className={`character-container ${characterActive ? 'active' : ''}`}>
              <div className="loading-dots"></div>
            </div>
          </>
        )}
      </div>

      <div className="controls">
        {!isActive ? (
          <button onClick={handleStart}>{translations.start || 'Start'}</button>
        ) : (
          <button onClick={handleStop}>{translations.stop || 'Stop'}</button>
        )}
        <button onClick={handleReset}>{translations.reset || 'Reset'}</button>
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
          language={language}
          setLanguage={setLanguage}
          translations={translations}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
