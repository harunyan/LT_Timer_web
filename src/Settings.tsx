import React from 'react';

interface SettingsProps {
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
  onClose: () => void; // 設定画面を閉じるためのコールバック
}

const Settings: React.FC<SettingsProps> = ({
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
  onClose,
}) => {
  return (
    <div className="settings-panel">
      <h2>Settings</h2>
      <div className="control-group">
        <label>Start Time:</label>
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
        <span>min</span>
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
        />
        <span>sec</span>
      </div>
      <div className="control-group">
        <label>Play Start Sound at:</label>
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
        <span>min</span>
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
        />
        <span>sec</span>
      </div>
      <div className="control-group">
        <label>Remind Sound at:</label>
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
        <span>min</span>
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
        />
        <span>sec</span>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Settings;
