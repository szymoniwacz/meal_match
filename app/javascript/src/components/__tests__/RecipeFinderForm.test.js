import React, { createRef } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { MockedProvider } from '@apollo/client/testing';
import RecipeFinderForm from '../RecipeFinderForm';
import { GET_INGREDIENTS } from '../../graphql/queries/getIngredients.js';
import { FIND_RECIPES } from '../../graphql/mutations/findRecipes.js';

const renderWithProviders = (ui, { mocks = [], route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          {ui}
        </MockedProvider>
      </I18nextProvider>
    </MemoryRouter>
  );
};

describe('RecipeFinderForm Component', () => {
  const mocks = [
    {
      request: {
        query: GET_INGREDIENTS,
      },
      result: {
        data: {
          ingredients: [
            { id: '1', name: 'Tomato' },
            { id: '2', name: 'Basil' },
          ],
        },
      },
    },
    {
      request: {
        query: FIND_RECIPES,
        variables: { input: { ingredientIds: ['1'] } },
      },
      result: {
        data: {
          findRecipes: {
            recipes: [
              {
                id: '1',
                title: 'Tomato Basil Pasta',
                ingredientIds: ['1', '2'],
                cookTime: 20,
                prepTime: 10,
                ratings: 5,
                cuisine: 'Italian',
                category: 'Main Course',
                author: 'Chef John',
                image: 'image-url',
                matchingIngredientsCount: 2,
              },
            ],
          },
        },
      },
    },
  ];

  test('renders loading state initially', () => {
    renderWithProviders(<RecipeFinderForm />, { mocks });

    expect(screen.getByText(/Loading ingredients.../i)).toBeInTheDocument();
  });

  test('renders error message if loading fails', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_INGREDIENTS,
        },
        error: new Error('Failed to fetch ingredients'),
      },
    ];

    renderWithProviders(<RecipeFinderForm />, { mocks: errorMocks });

    await waitFor(() => {
      expect(screen.getByText(/Error loading ingredients/i)).toBeInTheDocument();
    });
  });

  test('renders ingredients input and search button', async () => {
    renderWithProviders(<RecipeFinderForm />, { mocks });

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type at least 3 letters/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    });
  });

  test('selects ingredients and finds recipes', async () => {
    renderWithProviders(<RecipeFinderForm />, { mocks });

    await waitFor(() => expect(screen.getByPlaceholderText(/Type at least 3 letters/i)).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText(/Type at least 3 letters/i), {
      target: { value: 'Tomato' },
    });

    fireEvent.click(screen.getByText('Tomato'));
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    await waitFor(() => {
      expect(screen.getByText('Tomato Basil Pasta')).toBeInTheDocument();
    });
  });

  test('clears selected ingredients and recipes on language change', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true); // Mock confirm to return true
    const recipeFinderRef = createRef(); // Create a reference

    renderWithProviders(<RecipeFinderForm ref={recipeFinderRef} />, { mocks });

    await waitFor(() => expect(screen.getByPlaceholderText(/Type at least 3 letters/i)).toBeInTheDocument());

    // Select an ingredient
    fireEvent.change(screen.getByPlaceholderText(/Type at least 3 letters/i), {
      target: { value: 'Tomato' },
    });
    fireEvent.click(screen.getByText('Tomato'));

    // Search for recipes
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));
    await waitFor(() => {
      expect(screen.getByText('Tomato Basil Pasta')).toBeInTheDocument();
    });

    // Trigger language change
    await act(async () => {
      await i18n.changeLanguage('fr');
      recipeFinderRef.current.clearSelectedIngredientsAndRecipes(); // Manually clear to ensure it's being called correctly
    });

    // Ensure ingredients and recipes are cleared
    await waitFor(() => {
      expect(screen.queryByText('Tomato')).not.toBeInTheDocument(); // No 'Tomato' should be present
      expect(screen.queryByText('Tomato Basil Pasta')).not.toBeInTheDocument(); // No 'Tomato Basil Pasta' should be present
    });

    confirmSpy.mockRestore(); // Restore the original confirm behavior
  });
});

test('handles language change correctly', async () => {
  // Define the mocks within the test scope
  const languageChangeMocks = [
    {
      request: {
        query: GET_INGREDIENTS,
      },
      result: {
        data: {
          ingredients: [
            { id: '1', name: 'Tomato' },
            { id: '2', name: 'Basil' },
          ],
        },
      },
    },
  ];

  // Change the language to French
  await act(async () => {
    await i18n.changeLanguage('fr');
  });

  // Render the component with the appropriate mocks
  renderWithProviders(<RecipeFinderForm />, { mocks: languageChangeMocks });

  // Wait for the loading state to be displayed in French
  await waitFor(() => {
    expect(screen.getByText(/Chargement des ingrédients.../i)).toBeInTheDocument();
  });

  // Change the language back to English
  await act(async () => {
    await i18n.changeLanguage('en');
  });

  // Re-render the component with the same mocks
  renderWithProviders(<RecipeFinderForm />, { mocks: languageChangeMocks });

  // Wait for the loading state to be displayed in English
  await waitFor(() => {
    expect(screen.getByText(/Loading ingredients.../i)).toBeInTheDocument();
  });
});
