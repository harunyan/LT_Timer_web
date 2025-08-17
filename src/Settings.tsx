import React, {useEffect, useState} from 'react';
import LanguageSelector from './components/LanguageSelector.tsx';
import TimeInputGroup from './components/TimeInputGroup.tsx';

interface Time {
  minutes: number;
  seconds: number;
}

interface SettingsProps {
  show: boolean;
  initialTime: Time;
  setInitialTime: (time: Time) => void;
  startSoundTime: Time;
  setStartSoundTime: (time: Time) => void;
  remindTime: Time;
  setRemindTime: (time: Time) => void;
  language: string;
  setLanguage: (language: string) => void;
  translations: { [key: string]: string };
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  show,
  initialTime,
  setInitialTime,
  startSoundTime,
  setStartSoundTime,
  remindTime,
  setRemindTime,
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

  const [englishTranslations, setEnglishTranslations] = useState<{ [key: string]: string }>({});

  useEffect(() => {
      const fetchTranslations = async () => {
          const enTranslations = await fetch(import.meta.env.BASE_URL + 'locales/en.json').then(res => res.json());
          setEnglishTranslations(enTranslations);
      }
      fetchTranslations();
  }, [])

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
          label={translations.startTimeLabel || englishTranslations.startTimeLabel}
          time={initialTime}
          setTime={setInitialTime}
          timeLocalStorageKey="initialTime"
          translations={translations}
        />

        <TimeInputGroup
          label={translations.startSoundLabel || englishTranslations.startSoundLabel}
          time={startSoundTime}
          setTime={setStartSoundTime}
          timeLocalStorageKey="startSoundTime"
          translations={translations}
        />

        <TimeInputGroup
          label={translations.remindSoundLabel || englishTranslations.remindSoundLabel}
          time={remindTime}
          setTime={setRemindTime}
          timeLocalStorageKey="remindTime"
          translations={translations}
        />

        <button onClick={onClose}>{translations.closeButton || englishTranslations.closeButton}</button>
      </div>
    </div>
  );
};

export default Settings;