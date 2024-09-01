import React from 'react';
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
        variables: { language: 'en' }, // Ensure the correct variable is passed here
      },
      result: {
        data: {
          ingredients: [
            { id: '1', name: 'Tomato', language: 'en' },
            { id: '2', name: 'Basil', language: 'en' },
          ],
        },
      },
    },
    {
      request: {
        query: FIND_RECIPES,
        variables: { input: { ingredientIds: ['1'], language: 'en' } }, // Added language variable
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
                language: 'en',
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
          variables: { language: 'en' },
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
    renderWithProviders(<RecipeFinderForm />, { mocks });

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
    });

    // Ensure ingredients and recipes are cleared
    await waitFor(() => {
      const ingredientList = screen.queryAllByText('Tomato');
      const recipeList = screen.queryAllByText('Tomato Basil Pasta');

      expect(ingredientList.length).toBe(0);
      expect(recipeList.length).toBe(0);
    });

    confirmSpy.mockRestore(); // Restore the original confirm behavior
  });

  test('handles language change correctly', async () => {
    const mocksForFrench = [
      {
        request: {
          query: GET_INGREDIENTS,
          variables: { language: 'fr' },
        },
        result: {
          data: {
            ingredients: [
              { id: '3', name: 'Tomate', language: 'fr' },
              { id: '4', name: 'Basilic', language: 'fr' },
            ],
          },
        },
      },
    ];

    await act(async () => {
      await i18n.changeLanguage('fr');
    });

    renderWithProviders(<RecipeFinderForm />, { mocks: mocksForFrench });

    await waitFor(() => {
      expect(screen.getByText(/Chargement des ingrédients.../i)).toBeInTheDocument();
    });

    await act(async () => {
      await i18n.changeLanguage('en');
    });

    renderWithProviders(<RecipeFinderForm />, { mocks });

    await waitFor(() => {
      expect(screen.getByText(/Loading ingredients.../i)).toBeInTheDocument();
    });
  });
});
