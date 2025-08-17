import { useState, useEffect, useRef } from 'react';
import './App.css';
import Settings from './Settings';
import AudioPlayer from './components/AudioPlayer.tsx';

interface Time {
  minutes: number;
  seconds: number;
}

function App() {
  const [initialTime, setInitialTime] = useState<Time>(() => {
    const savedTime = localStorage.getItem('initialTime');
    return savedTime ? JSON.parse(savedTime) : { minutes: 5, seconds: 0 };
  });
  const [startSoundTime, setStartSoundTime] = useState<Time>(() => {
    const savedTime = localStorage.getItem('startSoundTime');
    return savedTime ? JSON.parse(savedTime) : { minutes: 5, seconds: 0 };
  });
  const [remindTime, setRemindTime] = useState<Time>(() => {
    const savedTime = localStorage.getItem('remindTime');
    return savedTime ? JSON.parse(savedTime) : { minutes: 1, seconds: 0 };
  });

  const [minutes, setMinutes] = useState(initialTime.minutes);
  const [seconds, setSeconds] = useState(initialTime.seconds);
  const [isActive, setIsActive] = useState(false);
  const [characterActive, setCharacterActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [englishTranslations, setEnglishTranslations] = useState<{ [key: string]: string }>({});
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const startAudioRef = useRef<HTMLAudioElement>(null);
  const endAudioRef = useRef<HTMLAudioElement>(null);
  const remindAudioRef = useRef<HTMLAudioElement>(null);

  const totalInitialSeconds = initialTime.minutes * 60 + initialTime.seconds;
  const startSoundTotalSeconds = startSoundTime.minutes * 60 + startSoundTime.seconds;
  const remindSoundTotalSeconds = remindTime.minutes * 60 + remindTime.seconds;

  useEffect(() => {
    const fetchTranslations = async () => {
      const enTranslations = await fetch(import.meta.env.BASE_URL + 'locales/en.json').then(res => res.json());
      setEnglishTranslations(enTranslations);
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
    if (!isActive) {
      setMinutes(initialTime.minutes);
      setSeconds(initialTime.seconds);
    }
  }, [initialTime, isActive]);

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
  }, [isActive, minutes, seconds, startSoundTotalSeconds, remindSoundTotalSeconds]);

  const handleStart = () => {
    if (isActive) {
      return; // すでにアクティブな場合は何もしない
    }

    // タイマーが初期状態または0に達した場合、初期時間から開始します
    if ((minutes === initialTime.minutes && seconds === initialTime.seconds) || (minutes === 0 && seconds === 0)) {
      setMinutes(initialTime.minutes);
      setSeconds(initialTime.seconds);
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
    setMinutes(initialTime.minutes);
    setSeconds(initialTime.seconds);
    setCharacterActive(false); // キャラクターをリセットする
  };

  return (
    <div className="App">
      <div className="timer-display">
        {minutes === 0 && seconds === 0 ? (
          <span className="time-is-up" style={{ color: 'red' }}>{translations.timeIsUp || englishTranslations.timeIsUp}</span>
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
          <button onClick={handleStart}>{translations.start || englishTranslations.start}</button>
        ) : (
          <button onClick={handleStop}>{translations.stop || englishTranslations.stop}</button>
        )}
        <button onClick={handleReset}>{translations.reset || englishTranslations.reset}</button>
        <button onClick={() => setShowSettings(true)}>⚙️</button>
      </div>

      <AudioPlayer
        audioRef={startAudioRef}
        srcFile={translations.startSoundFile}
        fallbackSrcFile={englishTranslations.startSoundFile}
      />
      <AudioPlayer
        audioRef={endAudioRef}
        srcFile={translations.endSoundFile}
        fallbackSrcFile={englishTranslations.endSoundFile}
      />
      <AudioPlayer
        audioRef={remindAudioRef}
        srcFile={translations.remindSoundFile}
        fallbackSrcFile={englishTranslations.remindSoundFile}
      />

      <Settings
        show={showSettings}
        initialTime={initialTime}
        setInitialTime={setInitialTime}
        startSoundTime={startSoundTime}
        setStartSoundTime={setStartSoundTime}
        remindTime={remindTime}
        setRemindTime={setRemindTime}
        language={language}
        setLanguage={setLanguage}
        translations={translations}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

export default App;
