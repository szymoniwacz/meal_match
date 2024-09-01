import React from 'react';
import { useMutation } from '@apollo/client';
import { SWITCH_LANGUAGE } from '../graphql/mutations/switchLanguage';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const [switchLanguage] = useMutation(SWITCH_LANGUAGE);
  const { i18n } = useTranslation();

  const handleLanguageChange = async (language) => {
    try {
      await switchLanguage({ variables: { input: language } });
      i18n.changeLanguage(language);
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  const currentLanguage = i18n.language;

  return (
    <div className="language-switcher">
      {currentLanguage === 'en' && (
        <button
          className="btn btn-secondary me-2"
          onClick={() => handleLanguageChange('fr')}
        >
          Français
        </button>
      )}
      {currentLanguage === 'fr' && (
        <button
          className="btn btn-secondary me-2"
          onClick={() => handleLanguageChange('en')}
        >
          English
        </button>
      )}
    </div>
  );
};

export default LanguageSwitcher;
