# frozen_string_literal: true

module Mutations
  class FindRecipes < Mutations::BaseMutation
    argument :input, Types::FindRecipesInputType, required: true

    field :recipes, [Types::RecipeType], null: false

    def resolve(input:)
      ingredient_ids = input[:ingredient_ids]
      recipes = RecipeFinderService.new(ingredient_ids).find_matching_recipes
      { recipes: }
    end
  end
end
