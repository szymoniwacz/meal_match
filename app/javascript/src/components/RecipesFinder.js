import React from 'react';
import { useTranslation } from 'react-i18next';
import RecipeFinderForm from './RecipeFinderForm';

const RecipesFinder = () => {
  const { t } = useTranslation();

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{t('recipes.finderTitle')}</h2>
      <RecipeFinderForm />
    </div>
  );
};

export default RecipesFinder;
