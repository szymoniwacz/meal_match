import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

const RecipeTable = ({ sortedRecipes, requestSort, getSortDirectionIcon }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-5">
      <h3>{t('recipeTable.foundRecipes')}</h3>
      <table className="table table-hover">
        <thead className="thead-dark">
          <tr>
            <th onClick={() => requestSort('title')}>
              {t('recipeTable.title')} {getSortDirectionIcon('title')}
            </th>
            <th onClick={() => requestSort('cookTime')}>
              {t('recipeTable.cookTime')} {getSortDirectionIcon('cookTime')}
            </th>
            <th onClick={() => requestSort('prepTime')}>
              {t('recipeTable.prepTime')} {getSortDirectionIcon('prepTime')}
            </th>
            <th onClick={() => requestSort('ratings')}>
              {t('recipeTable.ratings')} {getSortDirectionIcon('ratings')}
            </th>
            <th onClick={() => requestSort('matchingIngredientsCount')}>
              {t('recipeTable.matchingIngredientsCount')} {getSortDirectionIcon('matchingIngredientsCount')}
            </th>
            <th>{t('recipeTable.ingredients')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedRecipes().map((recipe) => (
            <tr key={recipe.id}>
              <td>{recipe.title}</td>
              <td>
                {recipe.cookTime !== undefined
                  ? `${recipe.cookTime} ${t('recipeTable.minutes')}`
                  : t('recipeTable.notAvailable')}
              </td>
              <td>
                {recipe.prepTime !== undefined
                  ? `${recipe.prepTime} ${t('recipeTable.minutes')}`
                  : t('recipeTable.notAvailable')}
              </td>
              <td>{recipe.ratings !== undefined ? recipe.ratings : t('recipeTable.notAvailable')}</td>
              <td>
                {recipe.matchingIngredientsCount !== undefined
                  ? recipe.matchingIngredientsCount
                  : t('recipeTable.notAvailable')}
              </td>
              <td>
                {recipe.ingredientNames ? recipe.ingredientNames.join(', ') : t('recipeTable.notAvailable')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

RecipeTable.propTypes = {
  sortedRecipes: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        cookTime: PropTypes.number,
        prepTime: PropTypes.number,
        ratings: PropTypes.number,
        matchingIngredientsCount: PropTypes.number,
        ingredientNames: PropTypes.arrayOf(PropTypes.string), // Updated to reflect ingredient names
      })
    ),
    PropTypes.func,
  ]).isRequired,
  requestSort: PropTypes.func.isRequired,
  getSortDirectionIcon: PropTypes.func.isRequired,
};

export default RecipeTable;
