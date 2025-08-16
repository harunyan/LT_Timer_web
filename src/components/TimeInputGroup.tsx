import React from 'react';

interface TimeInputGroupProps {
  label: string;
  minutes: number;
  setMinutes: (value: number) => void;
  seconds: number;
  setSeconds: (value: number) => void;
  minutesLocalStorageKey: string;
  secondsLocalStorageKey: string;
  translations: { [key: string]: string };
}

const TimeInputGroup: React.FC<TimeInputGroupProps> = ({
  label,
  minutes,
  setMinutes,
  seconds,
  setSeconds,
  minutesLocalStorageKey,
  secondsLocalStorageKey,
  translations,
}) => {
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMinutes(value);
    localStorage.setItem(minutesLocalStorageKey, value.toString());
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSeconds(value);
    localStorage.setItem(secondsLocalStorageKey, value.toString());
  };

  return (
    <div className="control-group">
      <label>{label}</label>
      <div>
        <input
          type="number"
          value={minutes}
          onChange={handleMinutesChange}
          min="0"
        />
        <span>{translations.minutesUnit || 'min'}</span>
        <input
          type="number"
          value={seconds}
          onChange={handleSecondsChange}
          min="0"
          max="59"
          step="5"
        />
        <span>{translations.secondsUnit || 'sec'}</span>
      </div>
    </div>
  );
};

export default TimeInputGroup;
