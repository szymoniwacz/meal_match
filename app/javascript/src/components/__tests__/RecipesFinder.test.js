import React from 'react';
import { render, screen } from '@testing-library/react';
import RecipesFinder from '../RecipesFinder';

jest.mock('../RecipeFinderForm', () => {
  const MockRecipeFinderForm = () => <div>Mocked RecipeFinderForm</div>;
  MockRecipeFinderForm.displayName = 'MockRecipeFinderForm';
  return MockRecipeFinderForm;
});

describe('RecipesFinder Component', () => {
  test('renders the Recipes Finder heading', () => {
    render(<RecipesFinder />);

    const headingElement = screen.getByText(/Recipes Finder/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the RecipeFinderForm component', () => {
    render(<RecipesFinder />);

    const formElement = screen.getByText('Mocked RecipeFinderForm');
    expect(formElement).toBeInTheDocument();
  });
});
