import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import SelectedIngredients from '../SelectedIngredients';

describe('SelectedIngredients Component', () => {
  const handleUnselectIngredient = jest.fn();

  const renderWithTranslation = (component) => {
    return render(
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    );
  };

  test('renders without selected ingredients', () => {
    renderWithTranslation(
      <SelectedIngredients
        selectedIngredients={[]}
        data={{ ingredients: [] }}
        handleUnselectIngredient={handleUnselectIngredient}
      />
    );

    expect(screen.getByText(/Selected Ingredients:/i)).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  test('renders with selected ingredients', () => {
    const selectedIngredients = ['1', '2'];
    const data = {
      ingredients: [
        { id: '1', name: 'Tomato' },
        { id: '2', name: 'Basil' },
      ],
    };

    renderWithTranslation(
      <SelectedIngredients
        selectedIngredients={selectedIngredients}
        data={data}
        handleUnselectIngredient={handleUnselectIngredient}
      />
    );

    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('Basil')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  test('handles unselecting an ingredient', () => {
    const selectedIngredients = ['1'];
    const data = {
      ingredients: [
        { id: '1', name: 'Tomato' },
      ],
    };

    renderWithTranslation(
      <SelectedIngredients
        selectedIngredients={selectedIngredients}
        data={data}
        handleUnselectIngredient={handleUnselectIngredient}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));

    expect(handleUnselectIngredient).toHaveBeenCalledWith('1');
  });

  test('checkbox is checked by default', () => {
    const selectedIngredients = ['1'];
    const data = {
      ingredients: [
        { id: '1', name: 'Tomato' },
      ],
    };

    renderWithTranslation(
      <SelectedIngredients
        selectedIngredients={selectedIngredients}
        data={data}
        handleUnselectIngredient={handleUnselectIngredient}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
});
