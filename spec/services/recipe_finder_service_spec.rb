# frozen_string_literal: true

require 'rails_helper'

RSpec.describe RecipeFinderService, type: :service do
  describe '#initialize' do
    subject(:service) { described_class.new(ingredient_ids:) }

    let(:ingredient_ids) { [1, 2, 3] }

    it 'assigns the ingredient_ids to an instance variable' do
      expect(service.instance_variable_get(:@ingredient_ids)).to eq(ingredient_ids)
    end
  end

  describe '#call' do
    subject(:service) { described_class.new(ingredient_ids:) }

    let(:ingredients) { create_list(:ingredient, 5) }
    let(:ingredient_ids) { ingredients[0..2].map(&:id) }
    let!(:recipes) { create_list(:recipe, 3) }

    before do
      create(:recipe_ingredient, recipe: recipes[0], ingredient: ingredients[0])
      create(:recipe_ingredient, recipe: recipes[0], ingredient: ingredients[1])
      create(:recipe_ingredient, recipe: recipes[1], ingredient: ingredients[0])
      create(:recipe_ingredient, recipe: recipes[1], ingredient: ingredients[2])
      create(:recipe_ingredient, recipe: recipes[2], ingredient: ingredients[3])
    end

    it 'returns recipes that match the given ingredients' do
      result = service.call
      expect(result).to contain_exactly(recipes[0], recipes[1])
    end

    it 'excludes recipes with no matching ingredients' do
      result = service.call
      expect(result).not_to include(recipes[2])
    end

    it 'returns an empty result when no recipes match the ingredients' do
      no_match_ingredient_ids = [ingredients[4].id]
      service_with_no_match = described_class.new(ingredient_ids: no_match_ingredient_ids)

      result = service_with_no_match.call
      expect(result).to be_empty
    end

    it 'handles cases where some ingredients do not match any recipe' do
      partial_match_ingredient_ids = [ingredients[0].id, ingredients[4].id]
      service_with_partial_match = described_class.new(ingredient_ids: partial_match_ingredient_ids)

      result = service_with_partial_match.call
      expect(result).to contain_exactly(recipes[0], recipes[1])
    end

    it 'handles an empty ingredient_ids array' do
      empty_ingredient_ids = []
      service_with_empty_ids = described_class.new(ingredient_ids: empty_ingredient_ids)

      result = service_with_empty_ids.call
      expect(result).to be_empty
    end

    it 'returns recipes even if ingredient_ids contains duplicates' do
      duplicate_ingredient_ids = [ingredients[0].id, ingredients[0].id, ingredients[1].id]
      service_with_duplicates = described_class.new(ingredient_ids: duplicate_ingredient_ids)

      result = service_with_duplicates.call
      expect(result).to contain_exactly(recipes[0], recipes[1])
    end

    it 'returns recipes even if ingredient_ids contains only one ingredient' do
      single_ingredient_id = [ingredients[0].id]
      service_with_single_id = described_class.new(ingredient_ids: single_ingredient_id)

      result = service_with_single_id.call
      expect(result).to contain_exactly(recipes[0], recipes[1])
    end

    context 'when recipes share the same ingredients' do
      it 'includes matching_ingredients_count and ingredient_ids for recipe1' do
        result = service.call
        recipe1_result = result.detect { |r| r.id == recipes[0].id }

        expect(recipe1_result.attributes.keys).to include(
          'matching_ingredients_count',
          'ingredient_names',
          'ingredient_ids',
        )
      end

      it 'matches correct ingredient_ids for recipe1' do
        result = service.call
        recipe1_result = result.detect { |r| r.id == recipes[0].id }

        expect(recipe1_result.ingredient_ids).to contain_exactly(ingredients[0].id, ingredients[1].id)
      end

      it 'counts matching ingredients correctly for recipe1' do
        result = service.call
        recipe1_result = result.detect { |r| r.id == recipes[0].id }

        expect(recipe1_result.matching_ingredients_count).to eq(2)
      end

      it 'includes matching_ingredients_count and ingredient_ids for recipe2' do
        result = service.call
        recipe2_result = result.detect { |r| r.id == recipes[1].id }

        expect(recipe2_result.attributes.keys).to include(
          'matching_ingredients_count',
          'ingredient_names',
          'ingredient_ids',
        )
      end

      it 'matches correct ingredient_ids for recipe2' do
        result = service.call
        recipe2_result = result.detect { |r| r.id == recipes[1].id }

        expect(recipe2_result.ingredient_ids).to contain_exactly(ingredients[0].id, ingredients[2].id)
      end

      it 'counts matching ingredients correctly for recipe2' do
        result = service.call
        recipe2_result = result.detect { |r| r.id == recipes[1].id }

        expect(recipe2_result.matching_ingredients_count).to eq(2)
      end
    end
  end
end
