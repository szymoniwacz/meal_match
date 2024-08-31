import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectedIngredients from '../SelectedIngredients';

describe('SelectedIngredients Component', () => {
  const handleUnselectIngredient = jest.fn();

  test('renders without selected ingredients', () => {
    render(
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

    render(
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

    render(
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

    render(
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
