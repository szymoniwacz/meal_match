import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_INGREDIENTS = gql`
  query GetIngredients {
    ingredients {
      id
      name
    }
  }
`;

const FIND_RECIPES = gql`
  mutation FindRecipes($input: FindRecipesInput!) {
    findRecipes(input: $input) {
      id
      name
      description
    }
  }
`;

const RecipeFinderForm = () => {
  const { data, loading, error } = useQuery(GET_INGREDIENTS);
  const [findRecipes] = useMutation(FIND_RECIPES);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleIngredientChange = (event) => {
    const { value } = event.target;
    setSelectedIngredients(
      selectedIngredients.includes(value)
        ? selectedIngredients.filter((ingredient) => ingredient !== value)
        : [...selectedIngredients, value]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await findRecipes({
        variables: { input: { ingredientIds: selectedIngredients } },
      });
      console.log('Found recipes:', data.findRecipes);
    } catch (error) {
      console.error('Error finding recipes:', error);
    }
  };

  if (loading) return <p>Loading ingredients...</p>;
  if (error) return <p>Error loading ingredients</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Find Recipes</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Select Ingredients:</label>
          <div className="form-check">
            {data.ingredients.map((ingredient) => (
              <div key={ingredient.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={ingredient.id}
                  id={`ingredient-${ingredient.id}`}
                  onChange={handleIngredientChange}
                />
                <label
                  className="form-check-label"
                  htmlFor={`ingredient-${ingredient.id}`}
                >
                  {ingredient.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Find Recipes
        </button>
      </form>
    </div>
  );
};

export default RecipeFinderForm;
