# frozen_string_literal: true

module Mutations
  class FindRecipes < Mutations::BaseMutation
    argument :input, Types::FindRecipesInputType, required: true

    field :recipes, [Types::RecipeType], null: false

    def resolve(input:)
      ingredient_ids = input[:ingredient_ids]
      language = input[:language]
      recipes = RecipeFinderService.new(ingredient_ids:, language:).call
      { recipes: }
    end
  end
end
