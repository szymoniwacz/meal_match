module Mutations
  class LoginUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true
    argument :remember_me, Boolean, required: false

    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :errors, [String], null: false

    def resolve(email:, password:, remember_me: false)
      user = User.find_for_authentication(email: email)
      return { user: nil, token: nil, errors: ['Invalid email or password'] } unless user

      if user.valid_password?(password)
        token = JWT.encode({ user_id: user.id }, Rails.application.secrets.secret_key_base)
        if remember_me
          user.remember_me!
          context[:cookies].permanent.signed[:remember_user_token] = {
            value: user.signed_id(purpose: "remember_me", expires_in: 2.weeks),
            httponly: true,
            secure: Rails.env.production?
          }
        end
        { user: user, token: token, errors: [] }
      else
        { user: nil, token: nil, errors: ['Invalid email or password'] }
      end
    end
  end
end
