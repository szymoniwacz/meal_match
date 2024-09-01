import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import RecipeTable from '../RecipeTable';

describe('RecipeTable Component', () => {
  const recipes = [
    {
      id: '1',
      title: 'Tomato Basil Pasta',
      cookTime: 20,
      prepTime: 10,
      ratings: 4.5,
      matchingIngredientsCount: 3,
      ingredientIds: ['1', '2', '3'],
    },
    {
      id: '2',
      title: 'Garlic Bread',
      cookTime: 15,
      prepTime: 5,
      ratings: 4.7,
      matchingIngredientsCount: 2,
      ingredientIds: ['4', '5'],
    },
  ];

  const sortedRecipes = jest.fn(() => recipes);
  const requestSort = jest.fn();
  const getSortDirectionIcon = jest.fn((key) => (key ? '↑' : ''));

  const renderWithTranslation = (component) => {
    return render(
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    );
  };

  test('renders the table headers correctly', () => {
    renderWithTranslation(
      <RecipeTable
        recipes={recipes}
        sortedRecipes={sortedRecipes}
        requestSort={requestSort}
        getSortDirectionIcon={getSortDirectionIcon}
      />
    );

    expect(screen.getByText(/Found Recipes/i)).toBeInTheDocument();
    expect(screen.getByText(/Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Cook Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Prep Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Ratings/i)).toBeInTheDocument();
    expect(screen.getByText(/Matching Ingredients Count/i)).toBeInTheDocument();
    expect(screen.getByText(/Ingredient IDs/i)).toBeInTheDocument();
  });

  test('renders the recipe rows correctly', () => {
    renderWithTranslation(
      <RecipeTable
        recipes={recipes}
        sortedRecipes={sortedRecipes}
        requestSort={requestSort}
        getSortDirectionIcon={getSortDirectionIcon}
      />
    );

    expect(screen.getByText('Tomato Basil Pasta')).toBeInTheDocument();
    expect(screen.getByText('Garlic Bread')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('4.7')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1, 2, 3')).toBeInTheDocument();
    expect(screen.getByText('4, 5')).toBeInTheDocument();
  });

  test('calls requestSort when a header is clicked', () => {
    renderWithTranslation(
      <RecipeTable
        recipes={recipes}
        sortedRecipes={sortedRecipes}
        requestSort={requestSort}
        getSortDirectionIcon={getSortDirectionIcon}
      />
    );

    fireEvent.click(screen.getByText(/Title/i));
    fireEvent.click(screen.getByText(/Cook Time/i));
    fireEvent.click(screen.getByText(/Prep Time/i));
    fireEvent.click(screen.getByText(/Ratings/i));
    fireEvent.click(screen.getByText(/Matching Ingredients Count/i));

    expect(requestSort).toHaveBeenCalledWith('title');
    expect(requestSort).toHaveBeenCalledWith('cookTime');
    expect(requestSort).toHaveBeenCalledWith('prepTime');
    expect(requestSort).toHaveBeenCalledWith('ratings');
    expect(requestSort).toHaveBeenCalledWith('matchingIngredientsCount');
  });

  test('renders sort direction icons correctly', () => {
    renderWithTranslation(
      <RecipeTable
        recipes={recipes}
        sortedRecipes={sortedRecipes}
        requestSort={requestSort}
        getSortDirectionIcon={getSortDirectionIcon}
      />
    );

    expect(getSortDirectionIcon).toHaveBeenCalledWith('title');
    expect(getSortDirectionIcon).toHaveBeenCalledWith('cookTime');
    expect(getSortDirectionIcon).toHaveBeenCalledWith('prepTime');
    expect(getSortDirectionIcon).toHaveBeenCalledWith('ratings');
    expect(getSortDirectionIcon).toHaveBeenCalledWith('matchingIngredientsCount');

    // Check only headers that should have a sort icon
    expect(screen.getByText(/Title/i)).toHaveTextContent('↑');
    expect(screen.getByText(/Cook Time/i)).toHaveTextContent('↑');
    expect(screen.getByText(/Prep Time/i)).toHaveTextContent('↑');
    expect(screen.getByText(/Ratings/i)).toHaveTextContent('↑');
    expect(screen.getByText(/Matching Ingredients Count/i)).toHaveTextContent('↑');

    // Ensure that the "Ingredient IDs" column does not have a sort icon
    expect(screen.getByText(/Ingredient IDs/i)).not.toHaveTextContent('↑');
  });
});
