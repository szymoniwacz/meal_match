# frozen_string_literal: true

module Types
  class FindRecipesInputType < Types::BaseInputObject
    graphql_name 'FindRecipesInput'

    argument :ingredient_ids, [ID], required: true, description: 'List of ingredient IDs'
    argument :language, String, required: true, description: 'Language of ingredient'
  end
end
