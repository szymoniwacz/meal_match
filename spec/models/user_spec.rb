# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'devise modules' do
    it 'includes database_authenticatable' do
      expect(described_class.devise_modules).to include(:database_authenticatable)
    end

    it 'includes registerable' do
      expect(described_class.devise_modules).to include(:registerable)
    end

    it 'includes recoverable' do
      expect(described_class.devise_modules).to include(:recoverable)
    end

    it 'includes rememberable' do
      expect(described_class.devise_modules).to include(:rememberable)
    end

    it 'includes validatable' do
      expect(described_class.devise_modules).to include(:validatable)
    end
  end

  describe '#generate_jwt' do
    it 'generates a JWT token with the correct payload' do
      user = described_class.create!(email: 'user@example.com', password: 'password')
      token = user.generate_jwt
      decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]

      expect(decoded_token['id']).to eq(user.id)
      expect(Time.at(decoded_token['exp']).to_i).to be_within(1.minute).of(60.days.from_now.to_i)
    end
  end
end
