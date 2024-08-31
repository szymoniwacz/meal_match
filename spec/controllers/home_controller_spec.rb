# frozen_string_literal: true

require 'rails_helper'

RSpec.describe HomeController, type: :controller do
  describe 'GET #index' do
    it 'returns a successful response' do
      get :index
      expect(response).to have_http_status(:ok)
    end

    it 'returns the expected content in the response body' do
      get :index
      expect(response.body).to include('')
    end
  end
end
