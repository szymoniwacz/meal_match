# frozen_string_literal: true

class RecipeFinderService
  def initialize(ingredient_ids, language)
    @ingredient_ids = ingredient_ids
    @language = language
  end

  def find_matching_recipes
    recipes = Recipe.where(language: @language).map do |recipe|
      matching_ingredients_count = recipe.ingredients.where(id: @ingredient_ids, language: @language).count
      { recipe:, matching_ingredients_count: }
    end

    recipes.sort_by { |result| -result[:matching_ingredients_count] }
  end
end
