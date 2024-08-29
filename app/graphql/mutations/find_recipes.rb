module Mutations
  class FindRecipes < Mutations::BaseMutation
    graphql_name 'FindRecipes'

    argument :ingredients, [String], required: true

    field :recipes, [Types::RecipeType], null: false

    def resolve(ingredients:)
      recipes = RecipeFinderService.new(ingredients).call

      { recipes: recipes }
    end
  end
end
