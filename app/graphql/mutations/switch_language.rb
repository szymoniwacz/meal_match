# frozen_string_literal: true

module Mutations
  class SwitchLanguage < Mutations::BaseMutation
    graphql_name 'SwitchLanguage'

    argument :input, String, required: true

    field :success, Boolean, null: false

    def resolve(input:)
      if context[:current_user]
        context[:current_user].update(language: input)
      else
        context[:session] ||= {}
        context[:session][:language] = input
      end

      { success: true }
    end
  end
end
