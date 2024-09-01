# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Recipe, type: :model do
  describe 'associations' do
    it 'has many recipe_ingredients with dependent destroy' do
      expect(described_class.reflect_on_association(:recipe_ingredients).macro).to eq(:has_many)
      expect(described_class.reflect_on_association(:recipe_ingredients).options[:dependent]).to eq(:destroy)
    end

    it 'has many ingredients through recipe_ingredients' do
      expect(described_class.reflect_on_association(:ingredients).macro).to eq(:has_many)
      expect(described_class.reflect_on_association(:ingredients).options[:through]).to eq(:recipe_ingredients)
    end
  end

  describe 'dependent destroy' do
    it 'destroys associated recipe_ingredients when the recipe is destroyed' do
      recipe = described_class.create!(title: 'Cake', language: 'en')
      ingredient = Ingredient.create!(name: 'Sugar', language: 'en')
      RecipeIngredient.create!(recipe:, ingredient:)

      expect { recipe.destroy }.to change(RecipeIngredient, :count).by(-1)
    end
  end
end
