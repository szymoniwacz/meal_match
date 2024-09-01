# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::LoginUser, type: :request do
  describe '.resolve' do
    let(:user) { create(:user, email: 'test@example.com', password: 'password') }

    let(:query) do
      <<~GRAPHQL
        mutation LoginUser($email: String!, $password: String!, $rememberMe: Boolean) {
          loginUser(email: $email, password: $password, rememberMe: $rememberMe) {
            user {
              id
              email
            }
            token
            errors
          }
        }
      GRAPHQL
    end

    def execute_query(variables)
      MealMatchSchema.execute(query, variables:, context: { cookies: })
    end

    context 'with valid credentials' do
      it 'returns the user id' do
        data = execute_query(email: user.email, password: 'password')['data']['loginUser']
        expect(data['user']['id']).to eq(user.id.to_s)
      end

      it 'returns the user email' do
        data = execute_query(email: user.email, password: 'password')['data']['loginUser']
        expect(data['user']['email']).to eq(user.email)
      end

      it 'returns a token' do
        data = execute_query(email: user.email, password: 'password')['data']['loginUser']
        expect(data['token']).to be_present
      end

      it 'returns no errors' do
        data = execute_query(email: user.email, password: 'password')['data']['loginUser']
        expect(data['errors']).to be_empty
      end
    end

    context 'with invalid password' do
      it 'returns no user' do
        data = execute_query(email: user.email, password: 'wrong_password')['data']['loginUser']
        expect(data['user']).to be_nil
      end

      it 'returns no token' do
        data = execute_query(email: user.email, password: 'wrong_password')['data']['loginUser']
        expect(data['token']).to be_nil
      end

      it 'returns an error message' do
        data = execute_query(email: user.email, password: 'wrong_password')['data']['loginUser']
        expect(data['errors']).to include('Invalid email or password')
      end
    end

    context 'with invalid email' do
      it 'returns no user' do
        data = execute_query(email: 'wrong@example.com', password: 'password')['data']['loginUser']
        expect(data['user']).to be_nil
      end

      it 'returns no token' do
        data = execute_query(email: 'wrong@example.com', password: 'password')['data']['loginUser']
        expect(data['token']).to be_nil
      end

      it 'returns an error message' do
        data = execute_query(email: 'wrong@example.com', password: 'password')['data']['loginUser']
        expect(data['errors']).to include('Invalid email or password')
      end
    end

    context 'with remember_me option' do
      # rubocop:disable RSpec/VerifiedDoubles
      let(:cookies) { double('cookies', permanent: double(signed: signed_cookies)) }
      let(:signed_cookies) { double('signed_cookies') }
      # rubocop:enable RSpec/VerifiedDoubles

      before do
        allow(signed_cookies).to receive(:[]=)
      end

      it 'returns the user id' do
        data = execute_query(email: user.email, password: 'password', rememberMe: true)['data']['loginUser']
        expect(data['user']['id']).to eq(user.id.to_s)
      end

      it 'returns the user email' do
        data = execute_query(email: user.email, password: 'password', rememberMe: true)['data']['loginUser']
        expect(data['user']['email']).to eq(user.email)
      end

      it 'returns a token' do
        data = execute_query(email: user.email, password: 'password', rememberMe: true)['data']['loginUser']
        expect(data['token']).to be_present
      end

      it 'returns no errors' do
        data = execute_query(email: user.email, password: 'password', rememberMe: true)['data']['loginUser']
        expect(data['errors']).to be_empty
      end

      it 'sets the remember_me cookie' do
        execute_query(email: user.email, password: 'password', rememberMe: true)
        expect(signed_cookies).to have_received(:[]=).with(:remember_user_token, anything)
      end
    end
  end
end
