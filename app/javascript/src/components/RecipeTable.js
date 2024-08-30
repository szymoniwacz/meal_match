import React from 'react';

const RecipeTable = ({ recipes, sortedRecipes, requestSort, getSortDirectionIcon }) => (
  <div className="mt-5">
    <h3>Found Recipes</h3>
    <table className="table table-hover">
      <thead className="thead-dark">
        <tr>
          <th onClick={() => requestSort('title')}>
            Title {getSortDirectionIcon('title')}
          </th>
          <th onClick={() => requestSort('cookTime')}>
            Cook Time {getSortDirectionIcon('cookTime')}
          </th>
          <th onClick={() => requestSort('prepTime')}>
            Prep Time {getSortDirectionIcon('prepTime')}
          </th>
          <th onClick={() => requestSort('ratings')}>
            Ratings {getSortDirectionIcon('ratings')}
          </th>
          <th onClick={() => requestSort('matchingIngredientsCount')}>
            Matching Ingredients Count {getSortDirectionIcon('matchingIngredientsCount')}
          </th>
          <th>Ingredient IDs</th>
        </tr>
      </thead>
      <tbody>
        {sortedRecipes().map((recipe) => (
          <tr key={recipe.id}>
            <td>{recipe.title}</td>
            <td>{recipe.cookTime}</td>
            <td>{recipe.prepTime}</td>
            <td>{recipe.ratings}</td>
            <td>{recipe.matchingIngredientsCount}</td>
            <td>{recipe.ingredientIds.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RecipeTable;
