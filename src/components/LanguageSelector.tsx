import React, { useState, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
}

interface LanguageSelectorProps {
  language: string;
  setLanguage: (language: string) => void;
  label: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage, label }) => {
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

  return (
    <div className="control-group">
      <label>{label}</label>
      <div>
        <select value={language} onChange={handleLanguageChange}>
          {availableLanguages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
