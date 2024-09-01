import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import LanguageSwitcher from '../LanguageSwitcher';
import { SWITCH_LANGUAGE } from '../../graphql/mutations/switchLanguage';
import i18n from '../../i18n';

const mocks = [
  {
    request: {
      query: SWITCH_LANGUAGE,
      variables: { input: 'fr' },
    },
    result: {
      data: {
        switchLanguage: {
          success: true,
        },
      },
    },
  },
  {
    request: {
      query: SWITCH_LANGUAGE,
      variables: { input: 'en' },
    },
    result: {
      data: {
        switchLanguage: {
          success: true,
        },
      },
    },
  },
];

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('switches to French and clears selected ingredients and recipes', async () => {
    i18n.changeLanguage('en');
    const mockRecipeFinderRef = {
      current: {
        confirmLanguageChange: jest.fn(() => true),
        clearSelectedIngredientsAndRecipes: jest.fn(),
      },
    };

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LanguageSwitcher recipeFinderRef={mockRecipeFinderRef} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Français/i }));

    await waitFor(() => expect(i18n.language).toBe('fr'));

    expect(mockRecipeFinderRef.current.confirmLanguageChange).toHaveBeenCalled();
    expect(mockRecipeFinderRef.current.clearSelectedIngredientsAndRecipes).toHaveBeenCalled();
  });

  test('switches to English and clears selected ingredients and recipes', async () => {
    i18n.changeLanguage('fr');
    const mockRecipeFinderRef = {
      current: {
        confirmLanguageChange: jest.fn(() => true),
        clearSelectedIngredientsAndRecipes: jest.fn(),
      },
    };

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LanguageSwitcher recipeFinderRef={mockRecipeFinderRef} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /English/i }));

    await waitFor(() => expect(i18n.language).toBe('en'));

    expect(mockRecipeFinderRef.current.confirmLanguageChange).toHaveBeenCalled();
    expect(mockRecipeFinderRef.current.clearSelectedIngredientsAndRecipes).toHaveBeenCalled();
  });
});
