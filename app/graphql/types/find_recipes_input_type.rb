# frozen_string_literal: true

module Types
  class FindRecipesInputType < Types::BaseInputObject
    graphql_name 'FindRecipesInput'

    argument :ingredient_ids, [ID], required: true, description: 'List of ingredient IDs'
  end
end
