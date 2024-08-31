# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::RegisterUser, type: :request do
  describe '.resolve' do
    let(:query) do
      <<~GRAPHQL
        mutation RegisterUser($email: String!, $password: String!, $passwordConfirmation: String!) {
          registerUser(email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
            user {
              id
              email
            }
            errors
          }
        }
      GRAPHQL
    end

    context 'with valid parameters' do
      it 'creates a new user with the correct email' do
        result = MealMatchSchema.execute(query,
                                         variables: { email: 'test@example.com', password: 'password',
                                                      passwordConfirmation: 'password' })

        data = result['data']['registerUser']

        expect(data['user']['email']).to eq('test@example.com')
      end

      it 'returns no errors' do
        result = MealMatchSchema.execute(query,
                                         variables: { email: 'test@example.com', password: 'password',
                                                      passwordConfirmation: 'password' })

        data = result['data']['registerUser']

        expect(data['errors']).to be_empty
      end
    end

    context 'with password confirmation mismatch' do
      it 'does not create a user' do
        result = MealMatchSchema.execute(query,
                                         variables: { email: 'test@example.com', password: 'password',
                                                      passwordConfirmation: 'different_password' })

        data = result['data']['registerUser']

        expect(data['user']).to be_nil
      end

      it 'returns a password confirmation mismatch error' do
        result = MealMatchSchema.execute(query,
                                         variables: { email: 'test@example.com', password: 'password',
                                                      passwordConfirmation: 'different_password' })

        data = result['data']['registerUser']

        expect(data['errors']).to include("Password confirmation doesn't match Password")
      end
    end

    context 'with invalid email format' do
      it 'does not create a user' do
        result = MealMatchSchema.execute(query,
                                         variables: { email: 'invalid_email', password: 'password',
                                                      passwordConfirmation: 'password' })

        data = result['data']['registerUser']

        expect(data['user']).to be_nil
      end

      it 'returns an invalid email error' do
        result = MealMatchSchema.execute(query,
                                         variables: { email: 'invalid_email', password: 'password',
                                                      passwordConfirmation: 'password' })

        data = result['data']['registerUser']

        expect(data['errors']).to include('Email is invalid')
      end
    end

    context 'with missing email' do
      it 'does not create a user' do
        result = MealMatchSchema.execute(query,
                                         variables: { email: '', password: 'password',
                                                      passwordConfirmation: 'password' })

        data = result['data']['registerUser']

        expect(data['user']).to be_nil
      end

      it 'returns a missing email error' do
        result = MealMatchSchema.execute(query,
                                         variables: { email: '', password: 'password',
                                                      passwordConfirmation: 'password' })

        data = result['data']['registerUser']

        expect(data['errors']).to include("Email can't be blank")
      end
    end

    context 'with missing password' do
      it 'does not create a user' do
        result = MealMatchSchema.execute(query,
                                         variables: { email: 'test@example.com', password: '',
                                                      passwordConfirmation: '' })

        data = result['data']['registerUser']

        expect(data['user']).to be_nil
      end

      it 'returns a missing password error' do
        result = MealMatchSchema.execute(query,
                                         variables: { email: 'test@example.com', password: '',
                                                      passwordConfirmation: '' })

        data = result['data']['registerUser']

        expect(data['errors']).to include("Password can't be blank")
      end
    end

    context 'when the email is already taken' do
      before do
        create(:user, email: 'test@example.com')
      end

      it 'does not create a user' do
        result = MealMatchSchema.execute(query,
                                         variables: { email: 'test@example.com', password: 'password',
                                                      passwordConfirmation: 'password' })

        data = result['data']['registerUser']

        expect(data['user']).to be_nil
      end

      it 'returns an email taken error' do
        result = MealMatchSchema.execute(query,
                                         variables: { email: 'test@example.com', password: 'password',
                                                      passwordConfirmation: 'password' })

        data = result['data']['registerUser']

        expect(data['errors']).to include('Email has already been taken')
      end
    end
  end
end
