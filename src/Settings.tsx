import React from 'react';
import LanguageSelector from './components/LanguageSelector.tsx';
import TimeInputGroup from './components/TimeInputGroup.tsx';

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
  onClose: () => void;
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
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`settings-panel-wrapper ${show ? 'active' : ''}`} onClick={handleBackdropClick}>
      <div className="settings-panel">
        <h2>{translations.settingsTitle || 'Settings'}</h2>

        <LanguageSelector
          language={language}
          setLanguage={setLanguage}
          label={translations.languageLabel || 'Language:'}
        />

        <TimeInputGroup
          label={translations.startTimeLabel || 'Initial Time:'}
          minutes={initialMinutes}
          setMinutes={setInitialMinutes}
          seconds={initialSeconds}
          setSeconds={setInitialSeconds}
          minutesLocalStorageKey="initialMinutes"
          secondsLocalStorageKey="initialSeconds"
          translations={translations}
        />

        <TimeInputGroup
          label={translations.startSoundLabel || 'Notification at:'}
          minutes={startSoundMinutes}
          setMinutes={setStartSoundMinutes}
          seconds={startSoundSeconds}
          setSeconds={setStartSoundSeconds}
          minutesLocalStorageKey="startSoundMinutes"
          secondsLocalStorageKey="startSoundSeconds"
          translations={translations}
        />

        <TimeInputGroup
          label={translations.remindSoundLabel || 'Reminder at:'}
          minutes={remindMinutes}
          setMinutes={setRemindMinutes}
          seconds={remindSeconds}
          setSeconds={setRemindSeconds}
          minutesLocalStorageKey="remindMinutes"
          secondsLocalStorageKey="remindSeconds"
          translations={translations}
        />

        <button onClick={onClose}>{translations.closeButton || 'Close'}</button>
      </div>
    </div>
  );
};

export default Settings;