# frozen_string_literal: true

class RecipeFinderService
  def initialize(ingredient_ids:, language: 'en')
    @ingredient_ids = ingredient_ids
    @language = language
  end

  def call
    Recipe.joins(:ingredients)
      .where(query_string)
      .joins('LEFT JOIN recipe_ingredients AS ri ON ri.recipe_id = recipes.id')
      .joins('LEFT JOIN ingredients AS all_ingredients ON all_ingredients.id = ri.ingredient_id')
      .group('recipes.id')
      .select(select_columns)
      .order('matching_ingredients_count DESC')
  end

  private

  attr_reader :ingredient_ids, :language

  def query_string
    {
      ingredients: { id: ingredient_ids },
      language:,
    }
  end

  def select_columns
    <<-SQL.squish
      recipes.*,
      COUNT(DISTINCT ingredients.id) AS matching_ingredients_count,
      ARRAY_AGG(ingredients.id) AS ingredient_ids,
      ARRAY_AGG(DISTINCT all_ingredients.name ORDER BY all_ingredients.name) AS ingredient_names
    SQL
  end
end
