# frozen_string_literal: true

module Types
  class RecipeType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :ingredients, [String], null: false
    field :instructions, String, null: false
  end
end
