import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import IngredientInput from './IngredientInput';
import SelectedIngredients from './SelectedIngredients';
import RecipeTable from './RecipeTable';
import { GET_INGREDIENTS } from '../graphql/queries/getIngredients';
import { FIND_RECIPES } from '../graphql/mutations/findRecipes';
import 'bootstrap/dist/css/bootstrap.min.css';

const RecipeFinderForm = () => {
  const { data, loading, error } = useQuery(GET_INGREDIENTS);
  const [findRecipes] = useMutation(FIND_RECIPES);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });

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
      setSelectedIngredients((prevSelected) => {
        const updatedSelection = [...prevSelected, ingredientId];
        return updatedSelection;
      });
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
      setRecipes(data.findRecipes.recipes);
    } catch (error) {
      console.error('Error finding recipes:', error);
    }
  };

  const sortedRecipes = () => {
    const sortableItems = [...recipes];
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortDirectionIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '↕';
  };

  if (loading) return <p>Loading ingredients...</p>;
  if (error) return <p>Error loading ingredients</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Find Recipes</h2>
      <form onSubmit={handleSubmit}>
        <IngredientInput
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
          selectedIngredients={selectedIngredients}
        />
        <SelectedIngredients
          selectedIngredients={selectedIngredients}
          data={data}
          handleUnselectIngredient={handleUnselectIngredient}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {recipes.length > 0 && (
        <RecipeTable
          recipes={recipes}
          sortedRecipes={sortedRecipes}
          requestSort={requestSort}
          getSortDirectionIcon={getSortDirectionIcon}
        />
      )}
    </div>
  );
};

export default RecipeFinderForm;
