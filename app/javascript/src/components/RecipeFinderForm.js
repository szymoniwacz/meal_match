import React, { useState, useEffect } from 'react';
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
      recipes {
        id
        name
        instructions
      }
    }
  }
`;

const RecipeFinderForm = () => {
  const { data, loading, error } = useQuery(GET_INGREDIENTS);
  const [findRecipes] = useMutation(FIND_RECIPES);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    if (inputValue.length >= 3) {
      const filteredSuggestions = data.ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, data]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (ingredientId) => {
    if (!selectedIngredients.includes(ingredientId)) {
      setSelectedIngredients([...selectedIngredients, ingredientId]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleUnselectIngredient = (ingredientId) => {
    setSelectedIngredients(selectedIngredients.filter(id => id !== ingredientId));
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
          <label className="form-label">Start typing an ingredient:</label>
          <input
            type="text"
            className="form-control"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type at least 3 letters..."
          />
          {suggestions.length > 0 && (
            <ul className="list-group mt-2">
              {suggestions.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className={`list-group-item ${selectedIngredients.includes(ingredient.id) ? 'text-muted' : ''}`}
                  onClick={() => !selectedIngredients.includes(ingredient.id) && handleSuggestionClick(ingredient.id)}
                  style={{
                    cursor: selectedIngredients.includes(ingredient.id) ? 'not-allowed' : 'pointer',
                    backgroundColor: selectedIngredients.includes(ingredient.id) ? '#f8f9fa' : '',
                    border: '1px solid #dee2e6',
                  }}
                  onMouseOver={(e) => !selectedIngredients.includes(ingredient.id) && (e.currentTarget.style.backgroundColor = '#e9ecef')}
                  onMouseOut={(e) => !selectedIngredients.includes(ingredient.id) && (e.currentTarget.style.backgroundColor = '')}
                >
                  {ingredient.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-3">
          <h5>Selected Ingredients:</h5>
          <ul className="list-group">
            {selectedIngredients.map((ingredientId) => {
              const ingredient = data.ingredients.find(ing => ing.id === ingredientId);
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
        <button type="submit" className="btn btn-primary">
          Find Recipes
        </button>
      </form>
    </div>
  );
};

export default RecipeFinderForm;
