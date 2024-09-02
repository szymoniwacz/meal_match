import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import IngredientInput from './IngredientInput';
import SelectedIngredients from './SelectedIngredients';
import RecipeTable from './RecipeTable';
import { GET_INGREDIENTS } from '../graphql/queries/getIngredients';
import { FIND_RECIPES } from '../graphql/mutations/findRecipes';

const RecipeFinderForm = forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const [findRecipes] = useMutation(FIND_RECIPES);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });

  const { data, loading, error } = useQuery(GET_INGREDIENTS, {
    variables: { language: i18n.language }
  });

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

  useImperativeHandle(ref, () => ({
    clearSelectedIngredientsAndRecipes: () => {
      setSelectedIngredients([]);
      setRecipes([]);
    },
    confirmLanguageChange: () => {
      if (selectedIngredients.length > 0 || recipes.length > 0) {
        return window.confirm(
          t('recipes.confirmLanguageChange', 'Are you sure? Changing the language will clear the selected ingredients and found recipes.')
        );
      }
      return true;
    }
  }));

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (ingredientId) => {
    if (!selectedIngredients.includes(ingredientId)) {
      setSelectedIngredients((prevSelected) => [...prevSelected, ingredientId]);
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
        variables: { input: { ingredientIds: selectedIngredients, language: i18n.language } },
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

  if (loading) return <p>{t('recipes.loadingIngredients')}</p>;
  if (error) return <p>{t('recipes.errorLoadingIngredients')}</p>;

  return (
    <div className="container mt-5">
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
          {t('recipes.search')}
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
});

RecipeFinderForm.displayName = 'RecipeFinderForm';

export default RecipeFinderForm;
