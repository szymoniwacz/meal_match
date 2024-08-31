import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IngredientInput from '../IngredientInput';

describe('IngredientInput', () => {
  const setup = () => {
    const handleInputChange = jest.fn();
    const handleSuggestionClick = jest.fn();
    const selectedIngredients = ['1'];
    const suggestions = [
      { id: '1', name: 'Tomato' },
      { id: '2', name: 'Basil' },
      { id: '3', name: 'Garlic' },
    ];

    const utils = render(
      <IngredientInput
        inputValue=""
        handleInputChange={handleInputChange}
        suggestions={suggestions}
        handleSuggestionClick={handleSuggestionClick}
        selectedIngredients={selectedIngredients}
      />
    );

    const input = utils.getByPlaceholderText('Type at least 3 letters...');
    return {
      input,
      handleInputChange,
      handleSuggestionClick,
      selectedIngredients,
      suggestions,
      ...utils,
    };
  };

  test('renders the input element and label correctly', () => {
    setup();
    expect(screen.getByText(/Start typing an ingredient/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type at least 3 letters...')).toBeInTheDocument();
  });

  test('calls handleInputChange when the input value changes', () => {
    const { input, handleInputChange } = setup();
    fireEvent.change(input, { target: { value: 'Tom' } });
    expect(handleInputChange).toHaveBeenCalledTimes(1);
  });

  test('renders suggestions when available', () => {
    setup();
    expect(screen.getByText(/Tomato/i)).toBeInTheDocument();
    expect(screen.getByText(/Basil/i)).toBeInTheDocument();
    expect(screen.getByText(/Garlic/i)).toBeInTheDocument();
  });

  test('disables and styles selected ingredients correctly', () => {
    setup();
    const disabledItem = screen.getByText(/Tomato/i);
    expect(disabledItem).toHaveClass('disabled');
    expect(disabledItem).toHaveStyle('cursor: not-allowed');
    expect(disabledItem).toHaveStyle('color: #6c757d');
    expect(disabledItem).toHaveStyle('backgroundColor: #e9ecef');
  });

  test('calls handleSuggestionClick when clicking on an unselected suggestion', () => {
    const { handleSuggestionClick } = setup();
    const clickableItem = screen.getByText(/Basil/i);
    fireEvent.click(clickableItem);
    expect(handleSuggestionClick).toHaveBeenCalledTimes(1);
  });

  test('does not call handleSuggestionClick when clicking on a selected suggestion', () => {
    const { handleSuggestionClick } = setup();
    const disabledItem = screen.getByText(/Tomato/i);
    fireEvent.click(disabledItem);
    expect(handleSuggestionClick).not.toHaveBeenCalled();
  });
});
