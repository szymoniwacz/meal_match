import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { SWITCH_LANGUAGE } from '../graphql/mutations/switchLanguage';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ recipeFinderRef }) => {
  const [switchLanguage] = useMutation(SWITCH_LANGUAGE);
  const { i18n } = useTranslation();

  const handleLanguageChange = async (language) => {
    const shouldProceed = recipeFinderRef.current.confirmLanguageChange();

    if (shouldProceed) {
      try {
        await switchLanguage({ variables: { input: language } });
        recipeFinderRef.current.clearSelectedIngredientsAndRecipes();
        i18n.changeLanguage(language);
      } catch (error) {
        console.error('Error switching language:', error);
      }
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

LanguageSwitcher.propTypes = {
  recipeFinderRef: PropTypes.object.isRequired,
};

export default LanguageSwitcher;
