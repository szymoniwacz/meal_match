import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IngredientInput from '../IngredientInput';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

describe('IngredientInput', () => {
  const setup = (language = 'en') => {
    const handleInputChange = jest.fn();
    const handleSuggestionClick = jest.fn();
    const selectedIngredients = ['1'];
    const suggestions = [
      { id: '1', name: 'Tomato' },
      { id: '2', name: 'Basil' },
      { id: '3', name: 'Garlic' },
    ];

    i18n.changeLanguage(language);

    const placeholderText = language === 'fr' ? 'Tapez au moins 3 lettres...' : 'Type at least 3 letters...';

    const utils = render(
      <I18nextProvider i18n={i18n}>
        <IngredientInput
          inputValue=""
          handleInputChange={handleInputChange}
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
          selectedIngredients={selectedIngredients}
        />
      </I18nextProvider>
    );

    const input = utils.getByPlaceholderText(placeholderText);
    return {
      input,
      handleInputChange,
      handleSuggestionClick,
      selectedIngredients,
      suggestions,
      placeholderText,
      ...utils,
    };
  };

  test('renders the input element and label correctly', () => {
    setup();
    expect(screen.getByText(/Start typing an ingredient/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type at least 3 letters...')).toBeInTheDocument();
  });

  test('renders correctly in French after language change', () => {
    const { placeholderText } = setup('fr');
    expect(screen.getByText(/Commencez à taper un ingrédient/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  test('calls handleInputChange when the input value changes', () => {
    const { input, handleInputChange } = setup('fr');
    fireEvent.change(input, { target: { value: 'Tom' } });
    expect(handleInputChange).toHaveBeenCalledTimes(1);
  });

  test('renders suggestions when available', () => {
    setup('fr');
    expect(screen.getByText(/Tomato/i)).toBeInTheDocument();
    expect(screen.getByText(/Basil/i)).toBeInTheDocument();
    expect(screen.getByText(/Garlic/i)).toBeInTheDocument();
  });

  test('disables and styles selected ingredients correctly', () => {
    setup('fr');
    const disabledItem = screen.getByText(/Tomato/i);
    expect(disabledItem).toHaveClass('disabled');
    expect(disabledItem).toHaveStyle('cursor: not-allowed');
    expect(disabledItem).toHaveStyle('color: #6c757d');
    expect(disabledItem).toHaveStyle('backgroundColor: #e9ecef');
  });

  test('calls handleSuggestionClick when clicking on an unselected suggestion', () => {
    const { handleSuggestionClick } = setup('fr');
    const clickableItem = screen.getByText(/Basil/i);
    fireEvent.click(clickableItem);
    expect(handleSuggestionClick).toHaveBeenCalledTimes(1);
  });

  test('does not call handleSuggestionClick when clicking on a selected suggestion', () => {
    const { handleSuggestionClick } = setup('fr');
    const disabledItem = screen.getByText(/Tomato/i);
    fireEvent.click(disabledItem);
    expect(handleSuggestionClick).not.toHaveBeenCalled();
  });
});
