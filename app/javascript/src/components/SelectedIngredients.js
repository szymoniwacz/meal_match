import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

const SelectedIngredients = ({ selectedIngredients, data, handleUnselectIngredient }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-3">
      <h5>{t('selectedIngredients.title')}</h5>
      <ul className="list-group">
        {selectedIngredients.map((ingredientId) => {
          const ingredient = data.ingredients.find((ing) => ing.id === ingredientId);
          return (
            <li key={ingredientId} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked
                  onChange={() => handleUnselectIngredient(ingredientId)}
                />
                <label className="form-check-label ms-2">
                  {ingredient.name}
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

SelectedIngredients.propTypes = {
  selectedIngredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.shape({
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  handleUnselectIngredient: PropTypes.func.isRequired,
};

export default SelectedIngredients;
