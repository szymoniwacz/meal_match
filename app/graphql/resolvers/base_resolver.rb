# frozen_string_literal: true

module Resolvers
  class BaseResolver < GraphQL::Schema::Resolver
    def resolve(**args)
      super
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError, e.message
    end
  end
end
