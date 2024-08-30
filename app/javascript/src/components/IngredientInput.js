import React from 'react';

const IngredientInput = ({ inputValue, handleInputChange, suggestions, handleSuggestionClick }) => (
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
        {suggestions.map((ingredient) => (
          <li
            key={ingredient.id}
            className={`list-group-item`}
            onClick={() => handleSuggestionClick(ingredient.id)}
            style={{
              cursor: 'pointer',
              border: '1px solid #dee2e6',
            }}
          >
            {ingredient.name}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default IngredientInput;
