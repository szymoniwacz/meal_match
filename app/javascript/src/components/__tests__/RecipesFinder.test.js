import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import RecipesFinder from '../RecipesFinder';

jest.mock('../RecipeFinderForm', () => {
  const MockRecipeFinderForm = () => <div>Mocked RecipeFinderForm</div>;
  MockRecipeFinderForm.displayName = 'MockRecipeFinderForm';
  return MockRecipeFinderForm;
});

describe('RecipesFinder Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the RecipesFinder with the correct title in English', () => {
    i18n.changeLanguage('en');

    render(
      <I18nextProvider i18n={i18n}>
        <RecipesFinder />
      </I18nextProvider>
    );

    expect(screen.getByRole('heading', { name: /Recipes Finder/i })).toBeInTheDocument();
    expect(screen.getByText(/Mocked RecipeFinderForm/i)).toBeInTheDocument();
  });

  test('renders the RecipesFinder with the correct title in French', () => {
    i18n.changeLanguage('fr');

    render(
      <I18nextProvider i18n={i18n}>
        <RecipesFinder />
      </I18nextProvider>
    );

    expect(screen.getByRole('heading', { name: /Chercheur de recettes/i })).toBeInTheDocument();
    expect(screen.getByText(/Mocked RecipeFinderForm/i)).toBeInTheDocument();
  });
});
