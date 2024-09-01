# frozen_string_literal: true

class RecipeFinderService
  def initialize(ingredient_ids, language: 'en')
    @ingredient_ids = ingredient_ids
    @language = language
  end

  def call
    Recipe.joins(:ingredients)
      .where(query_string)
      .group('recipes.id')
      .select(select_columns)
      .order('matching_ingredients_count DESC')
  end

  private

  attr_reader :ingredient_ids, :language

  def query_string
    {
      ingredients: { id: ingredient_ids },
      language: language
    }
  end

  def select_columns
    <<-SQL.squish
      recipes.*,
      COUNT(ingredients.id) AS matching_ingredients_count,
      ARRAY_AGG(ingredients.id) AS ingredient_ids
    SQL
  end
end
