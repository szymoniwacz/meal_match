import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import RecipeFinderForm from '../RecipeFinderForm';
import { mocks } from './mocks';

describe('RecipeFinderForm', () => {
  test('renders the recipe finder form', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RecipeFinderForm />
      </MockedProvider>
    );

    const headingElement = await waitFor(() => screen.getByText(/Find Recipes/i));
    expect(headingElement).toBeInTheDocument();
  });

  test('handles ingredient selection', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RecipeFinderForm />
      </MockedProvider>
    );

    const inputElement = await waitFor(() => screen.getByPlaceholderText(/Type at least 3 letters.../i));

    fireEvent.change(inputElement, { target: { value: 'Tom' } });

    const suggestionElement = await waitFor(() => screen.getByText(/Tomato/i));
    fireEvent.click(suggestionElement);

    const selectedIngredientElement = screen.getByText(/Tomato/i);
    expect(selectedIngredientElement).toBeInTheDocument();
  });

  test('submits the form and displays recipes', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RecipeFinderForm />
      </MockedProvider>
    );

    const inputElement = await screen.findByPlaceholderText(/Type at least 3 letters.../i);

    fireEvent.change(inputElement, { target: { value: 'Tom' } });
    const suggestionElement = await screen.findByText(/Tomato/i);
    fireEvent.click(suggestionElement);

    fireEvent.change(inputElement, { target: { value: 'Bas' } });
    const suggestionElementBasil = await screen.findByText(/Basil/i);
    fireEvent.click(suggestionElementBasil);

    const submitButton = screen.getByText(/Search/i);
    fireEvent.click(submitButton);

    // Ensure we wait for the mutation to finish and the recipes to be rendered
    const recipeElement = await waitFor(() => screen.getByText(/Tomato Basil Pasta/i));
    expect(recipeElement).toBeInTheDocument();
  });

  test('handles sorting of recipes', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RecipeFinderForm />
      </MockedProvider>
    );

    const inputElement = await screen.findByPlaceholderText(/Type at least 3 letters.../i);

    fireEvent.change(inputElement, { target: { value: 'Tom' } });
    const suggestionElement = await screen.findByText(/Tomato/i);
    fireEvent.click(suggestionElement);

    fireEvent.change(inputElement, { target: { value: 'Bas' } });
    const suggestionElementBasil = await screen.findByText(/Basil/i);
    fireEvent.click(suggestionElementBasil);

    const submitButton = screen.getByText(/Search/i);
    fireEvent.click(submitButton);

    // Ensure we wait for the mutation to finish and the recipes to be rendered
    const recipeElement = await waitFor(() => screen.getByText(/Tomato Basil Pasta/i));
    expect(recipeElement).toBeInTheDocument();

    // Use a more flexible matcher for the "Cook Time" header
    const sortButton = screen.getByText((content, element) =>
      element.tagName.toLowerCase() === 'th' && content.includes('Cook Time')
    );

    fireEvent.click(sortButton);

    const sortedRecipeElement = await waitFor(() => screen.getByText(/Tomato Basil Pasta/i));
    expect(sortedRecipeElement).toBeInTheDocument();
  });
});
