# frozen_string_literal: true

class RecipeFinderService
  attr_reader :ingredient_ids

  def initialize(ingredient_ids)
    @ingredient_ids = ingredient_ids
  end

  def call
    Recipe.joins(:ingredients)
      .where(ingredients: { id: ingredient_ids })
      .group('recipes.id')
      .select(select_columns)
      .order('matching_ingredients_count DESC')
  end

  private

  def select_columns
    <<-SQL.squish
      recipes.*,
      COUNT(ingredients.id) AS matching_ingredients_count,
      ARRAY_AGG(ingredients.id) AS ingredient_ids
    SQL
  end
end
