# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Ingredient, type: :model do
  describe 'associations' do
    it 'has many recipe_ingredients with dependent destroy' do
      expect(described_class.reflect_on_association(:recipe_ingredients).macro).to eq(:has_many)
      expect(described_class.reflect_on_association(:recipe_ingredients).options[:dependent]).to eq(:destroy)
    end

    it 'has many recipes through recipe_ingredients' do
      expect(described_class.reflect_on_association(:recipes).macro).to eq(:has_many)
      expect(described_class.reflect_on_association(:recipes).options[:through]).to eq(:recipe_ingredients)
    end
  end

  describe 'dependent destroy' do
    it 'destroys associated recipe_ingredients when the ingredient is destroyed' do
      ingredient = described_class.create!(name: 'Sugar', language: 'en')
      recipe = Recipe.create!(title: 'Cake', language: 'en')
      RecipeIngredient.create!(recipe:, ingredient:)

      expect { ingredient.destroy }.to change(RecipeIngredient, :count).by(-1)
    end
  end
end
