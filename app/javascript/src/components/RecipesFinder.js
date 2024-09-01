import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import RecipeFinderForm from './RecipeFinderForm';

const RecipesFinder = ({ recipeFinderRef }) => {
  const { t } = useTranslation();

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{t('recipes.finderTitle')}</h2>
      <RecipeFinderForm ref={recipeFinderRef} />
    </div>
  );
};

RecipesFinder.propTypes = {
  recipeFinderRef: PropTypes.object.isRequired,
};

export default RecipesFinder;
