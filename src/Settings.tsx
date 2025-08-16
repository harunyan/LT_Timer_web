import React, { useState, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
}

interface SettingsProps {
  show: boolean;
  initialMinutes: number;
  setInitialMinutes: (value: number) => void;
  initialSeconds: number;
  setInitialSeconds: (value: number) => void;
  startSoundMinutes: number;
  setStartSoundMinutes: (value: number) => void;
  startSoundSeconds: number;
  setStartSoundSeconds: (value: number) => void;
  remindMinutes: number;
  setRemindMinutes: (value: number) => void;
  remindSeconds: number;
  setRemindSeconds: (value: number) => void;
  language: string;
  setLanguage: (language: string) => void;
  translations: { [key: string]: string };
  onClose: () => void; // 設定画面を閉じるためのコールバック
}

const Settings: React.FC<SettingsProps> = ({
  show,
  initialMinutes,
  setInitialMinutes,
  initialSeconds,
  setInitialSeconds,
  startSoundMinutes,
  setStartSoundMinutes,
  startSoundSeconds,
  setStartSoundSeconds,
  remindMinutes,
  setRemindMinutes,
  remindSeconds,
  setRemindSeconds,
  language,
  setLanguage,
  translations,
  onClose,
}) => {
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'locales/index.json')
      .then(response => response.json())
      .then(data => setAvailableLanguages(data))
      .catch(error => console.error('Error fetching language index:', error));
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`settings-panel-wrapper ${show ? 'active' : ''}`} onClick={handleBackdropClick}>
      <div className="settings-panel">
        <h2>{translations.settingsTitle || 'Settings'}</h2>
        <div className="control-group">
          <label>{translations.languageLabel || 'Language:'}</label>
          <select value={language} onChange={handleLanguageChange}>
            {availableLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label>{translations.startTimeLabel || 'Start Time:'}</label>
          <div>
            <input
              type="number"
              value={initialMinutes}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setInitialMinutes(value);
                localStorage.setItem('initialMinutes', value.toString());
              }}
              min="0"
            />
            <span>{translations.minutesUnit || 'min'}</span>
            <input
              type="number"
              value={initialSeconds}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setInitialSeconds(value);
                localStorage.setItem('initialSeconds', value.toString());
              }}
              min="0"
              max="59"
              step="5"
            />
            <span>{translations.secondsUnit || 'sec'}</span>
          </div>
        </div>
        <div className="control-group">
          <label>{translations.startSoundLabel || 'Play Start Sound at:'}</label>
          <div>
            <input
              type="number"
              value={startSoundMinutes}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setStartSoundMinutes(value);
                localStorage.setItem('startSoundMinutes', value.toString());
              }}
              min="0"
            />
            <span>{translations.minutesUnit || 'min'}</span>
            <input
              type="number"
              value={startSoundSeconds}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setStartSoundSeconds(value);
                localStorage.setItem('startSoundSeconds', value.toString());
              }}
              min="0"
              max="59"
              step="5"
            />
            <span>{translations.secondsUnit || 'sec'}</span>
          </div>
        </div>
        <div className="control-group">
          <label>{translations.remindSoundLabel || 'Remind Sound at:'}</label>
          <div>
            <input
              type="number"
              value={remindMinutes}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setRemindMinutes(value);
                localStorage.setItem('remindMinutes', value.toString());
              }}
              min="0"
            />
            <span>{translations.minutesUnit || 'min'}</span>
            <input
              type="number"
              value={remindSeconds}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setRemindSeconds(value);
                localStorage.setItem('remindSeconds', value.toString());
              }}
              min="0"
              max="59"
              step="5"
            />
            <span>{translations.secondsUnit || 'sec'}</span>
          </div>
        </div>
        <button onClick={onClose}>{translations.closeButton || 'Close'}</button>
      </div>
    </div>
  );
};

export default Settings;