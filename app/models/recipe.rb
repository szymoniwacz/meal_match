# frozen_string_literal: true

class Recipe < ApplicationRecord
  has_many :recipe_ingredients, dependent: :destroy
  has_many :ingredients, through: :recipe_ingredients
end
