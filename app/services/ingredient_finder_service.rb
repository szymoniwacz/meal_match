# frozen_string_literal: true

class IngredientFinderService
  attr_reader :language

  def initialize(language:)
    @language = language
  end

  def call
    Ingredient.where(language:)
  end
end
