import React, {useEffect, useState} from 'react';
import LanguageSelector from './components/LanguageSelector.tsx';
import TimeInputGroup from './components/TimeInputGroup.tsx';
import { AllTimes, Time } from './App.tsx';

interface SettingsProps {
  show: boolean;
  allTimes: AllTimes;
  setAllTimes: (times: AllTimes) => void;
  language: string;
  setLanguage: (language: string) => void;
  translations: { [key: string]: string };
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  show,
  allTimes,
  setAllTimes,
  language,
  setLanguage,
  translations,
  onClose,
}) => {
  const [tempAllTimes, setTempAllTimes] = useState<AllTimes>(allTimes);

  const [englishTranslations, setEnglishTranslations] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const enTranslations = await fetch(import.meta.env.BASE_URL + 'locales/en.json').then(res => res.json());
      setEnglishTranslations(enTranslations);
    }
    fetchTranslations();
  }, [])

  useEffect(() => {
    if (show) {
      setTempAllTimes(allTimes);
    }
  }, [show, allTimes]);

  const handleOk = () => {
    setAllTimes(tempAllTimes);

    localStorage.setItem('initialTime', JSON.stringify(tempAllTimes.initialTime));
    localStorage.setItem('startSoundTime', JSON.stringify(tempAllTimes.startSoundTime));
    localStorage.setItem('remindTime', JSON.stringify(tempAllTimes.remindTime));

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
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
          label={translations.startTimeLabel || englishTranslations.startTimeLabel}
          time={tempAllTimes.initialTime}
          setTime={(newTime: Time) => setTempAllTimes(prev => ({ ...prev, initialTime: newTime }))}
          translations={translations}
        />

        <TimeInputGroup
          label={translations.startSoundLabel || englishTranslations.startSoundLabel}
          time={tempAllTimes.startSoundTime}
          setTime={(newTime: Time) => setTempAllTimes(prev => ({ ...prev, startSoundTime: newTime }))}
          translations={translations}
        />

        <TimeInputGroup
          label={translations.remindSoundLabel || englishTranslations.remindSoundLabel}
          time={tempAllTimes.remindTime}
          setTime={(newTime: Time) => setTempAllTimes(prev => ({ ...prev, remindTime: newTime }))}
          translations={translations}
        />

        <div className="settings-buttons">
          <button onClick={handleOk}>{translations.okButton || englishTranslations.okButton}</button>
          <button onClick={handleCancel}>{translations.cancelButton || englishTranslations.cancelButton}</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;