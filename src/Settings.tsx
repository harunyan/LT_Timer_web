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
  const [tempInitialTime, setTempInitialTime] = useState(initialTime);
  const [tempStartSoundTime, setTempStartSoundTime] = useState(startSoundTime);
  const [tempRemindTime, setTempRemindTime] = useState(remindTime);

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
      setTempInitialTime(initialTime);
      setTempStartSoundTime(startSoundTime);
      setTempRemindTime(remindTime);
    }
  }, [show, initialTime, startSoundTime, remindTime]);

  const handleOk = () => {
    setInitialTime(tempInitialTime);
    setStartSoundTime(tempStartSoundTime);
    setRemindTime(tempRemindTime);

    localStorage.setItem('initialTime', JSON.stringify(tempInitialTime));
    localStorage.setItem('startSoundTime', JSON.stringify(tempStartSoundTime));
    localStorage.setItem('remindTime', JSON.stringify(tempRemindTime));

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
          time={tempInitialTime}
          setTime={setTempInitialTime}
          translations={translations}
        />

        <TimeInputGroup
          label={translations.startSoundLabel || englishTranslations.startSoundLabel}
          time={tempStartSoundTime}
          setTime={setTempStartSoundTime}
          translations={translations}
        />

        <TimeInputGroup
          label={translations.remindSoundLabel || englishTranslations.remindSoundLabel}
          time={tempRemindTime}
          setTime={setTempRemindTime}
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