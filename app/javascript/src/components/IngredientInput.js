import PropTypes from 'prop-types';
import React from 'react';

const IngredientInput = ({ inputValue, handleInputChange, suggestions, handleSuggestionClick, selectedIngredients }) => (
  <div className="mb-3">
    <label className="form-label">Start typing an ingredient:</label>
    <input
      type="text"
      className="form-control"
      value={inputValue}
      onChange={handleInputChange}
      placeholder="Type at least 3 letters..."
    />
    {suggestions.length > 0 && (
      <ul className="list-group mt-2">
        {suggestions.map((ingredient) => {
          const isSelected = selectedIngredients.includes(ingredient.id);
          return (
            <li
              key={ingredient.id}
              className={`list-group-item ${isSelected ? 'disabled' : ''}`}
              onClick={() => !isSelected && handleSuggestionClick(ingredient.id)}
              style={{
                cursor: isSelected ? 'not-allowed' : 'pointer',
                color: isSelected ? '#6c757d' : 'inherit',
                backgroundColor: isSelected ? '#e9ecef' : 'inherit',
                border: '1px solid #dee2e6',
              }}
            >
              {ingredient.name}
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

IngredientInput.propTypes = {
  inputValue: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleSuggestionClick: PropTypes.func.isRequired,
  selectedIngredients: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
};

export default IngredientInput;
