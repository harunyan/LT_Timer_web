import React from 'react';

interface Time {
  minutes: number;
  seconds: number;
}

interface TimeInputGroupProps {
  label: string;
  time: Time;
  setTime: (time: Time) => void;
  timeLocalStorageKey: string;
  translations: { [key: string]: string };
}

const TimeInputGroup: React.FC<TimeInputGroupProps> = ({
  label,
  time,
  setTime,
  timeLocalStorageKey,
  translations,
}) => {
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = { ...time, minutes: parseInt(e.target.value, 10) };
    setTime(newTime);
    localStorage.setItem(timeLocalStorageKey, JSON.stringify(newTime));
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = { ...time, seconds: parseInt(e.target.value, 10) };
    setTime(newTime);
    localStorage.setItem(timeLocalStorageKey, JSON.stringify(newTime));
  };

  return (
    <div className="control-group">
      <label>{label}</label>
      <div>
        <input
          type="number"
          value={time.minutes}
          onChange={handleMinutesChange}
          min="0"
        />
        <span>{translations.minutesUnit || 'min'}</span>
        <input
          type="number"
          value={time.seconds}
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
