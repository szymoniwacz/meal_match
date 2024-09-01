# frozen_string_literal: true

require 'rails_helper'

RSpec.describe RecipeIngredient, type: :model do
  describe 'associations' do
    it 'belongs to a recipe' do
      expect(described_class.reflect_on_association(:recipe).macro).to eq(:belongs_to)
    end

    it 'belongs to an ingredient' do
      expect(described_class.reflect_on_association(:ingredient).macro).to eq(:belongs_to)
    end
  end
end
