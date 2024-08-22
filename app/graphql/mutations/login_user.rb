module Mutations
  class LoginUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true

    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :errors, [String], null: false

    def resolve(email:, password:)
      user = User.find_for_authentication(email: email)
      return { user: nil, token: nil, errors: ['Invalid email or password'] } unless user

      if user.valid_password?(password)
        if user.confirmed?
          token = JWT.encode({ user_id: user.id }, Rails.application.secrets.secret_key_base)
          { user: user, token: token, errors: [] }
        else
          { user: nil, token: nil, errors: ['You have to confirm your email address before continuing.'] }
        end
      else
        { user: nil, token: nil, errors: ['Invalid email or password'] }
      end
    end
  end
end
