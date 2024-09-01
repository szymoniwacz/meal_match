# frozen_string_literal: true

module Types
  class SwitchLanguageInputType < GraphQL::Schema::InputObject
    graphql_name 'SwitchLanguageInputType'

    argument :language, String, required: true
  end
end
