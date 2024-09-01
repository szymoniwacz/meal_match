# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::FindRecipes, type: :request do
  describe '.resolve' do
    let(:ingredients) { create_list(:ingredient, 2) }
    let(:recipes) { create_list(:recipe, 2, title: %w[Pancakes Omelette]) }
    let(:recipe_finder_service) { instance_double(RecipeFinderService) }

    let(:valid_input) do
      {
        input: {
          ingredientIds: ingredients.map(&:id),
          language: 'en',
        },
      }
    end

    let(:query) do
      <<~GRAPHQL
        mutation FindRecipes($input: FindRecipesInput!) {
          findRecipes(input: $input) {
            recipes {
              id
              title
              ingredientIds
              cookTime
              prepTime
              ratings
              cuisine
              category
              author
              image
              language
            }
          }
        }
      GRAPHQL
    end

    before do
      allow(RecipeFinderService).to receive(:new).and_return(recipe_finder_service)
      allow(recipe_finder_service).to receive(:call).and_return(recipes)
    end

    it 'returns recipes based on ingredient IDs' do
      result = execute_query(valid_input)
      data = result['data']['findRecipes']['recipes']
      expect_recipes_to_match(data, recipes)
    end

    it 'returns an empty array if no recipes are found' do
      allow(recipe_finder_service).to receive(:call).and_return([])

      result = execute_query(valid_input)
      expect_no_recipes_found(result)
    end

    it 'raises an error if input is missing' do
      result = execute_query({})
      expect_input_error(result)
    end
  end

  def execute_query(variables)
    MealMatchSchema.execute(query, variables:)
  end

  def log_graphql_errors(result)
    return unless result['errors']

    puts "GraphQL errors: #{result["errors"]}"
  end

  def expect_recipes_to_match(data, expected_recipes)
    expect(data.size).to eq(expected_recipes.size)
    expected_recipes.each_with_index do |recipe, index|
      expect_recipe_to_match(data[index], recipe)
    end
  end

  def expect_recipe_to_match(actual_data, expected_recipe)
    expect(actual_data['id']).to eq(expected_recipe.id.to_s)
    expect(actual_data['title']).to eq(expected_recipe.title)
  end

  def expect_no_recipes_found(result)
    data = result['data']['findRecipes']['recipes']
    expect(data).to eq([])
  end

  def expect_input_error(result)
    errors = result['errors']
    expect(errors).to be_present
    expect(errors.first['message']).to include('Variable $input of type FindRecipesInput! was provided invalid value')
  end
end
