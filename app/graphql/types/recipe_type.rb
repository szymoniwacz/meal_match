# frozen_string_literal: true

module Types
  class RecipeType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: false
    field :ingredient_ids, [ID], null: false
    field :ingredient_names, [String], null: false
    field :cook_time, Integer, null: true
    field :prep_time, Integer, null: true
    field :ratings, Float, null: true
    field :cuisine, String, null: true
    field :category, String, null: true
    field :author, String, null: true
    field :image, String, null: true
    field :matching_ingredients_count, Integer, null: false
    field :language, String, null: false
  end
end
