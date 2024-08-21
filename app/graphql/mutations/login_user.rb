# frozen_string_literal: true

module Mutations
  class LoginUser < Mutations::BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true

    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :errors, [String], null: false

    def resolve(email:, password:)
      user = User.find_for_authentication(email: email)
      if user&.valid_password?(password)
        token = user.generate_jwt
        { user: user, token: token, errors: [] }
      else
        { user: nil, token: nil, errors: ['Invalid credentials'] }
      end
    end
  end
end
