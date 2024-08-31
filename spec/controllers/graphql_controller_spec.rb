# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GraphqlController, type: :controller do
  describe 'POST #execute' do
    let(:query) { '{ someQuery { someField } }' }
    let(:variables) { { someVariable: 'value' } }
    let(:operation_name) { 'SomeOperation' }
    let(:current_user) { create(:user) }
    let(:context) { { current_user:, cookies: } }

    before do
      allow(controller).to receive(:current_user).and_return(current_user)
      allow(MealMatchSchema).to receive(:execute).and_return({ data: { someField: 'someValue' } })
    end

    context 'with valid params' do
      it 'executes the query and returns a successful response' do
        post :execute, params: { query:, variables:, operationName: operation_name }

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq('data' => { 'someField' => 'someValue' })
      end
    end

    context 'when an error occurs in development environment' do
      before do
        allow(Rails).to receive(:env).and_return(ActiveSupport::StringInquirer.new('development'))
        allow(MealMatchSchema).to receive(:execute).and_raise(StandardError.new('Some error'))
      end

      it 'handles the error and returns a 500 status with error details' do
        post :execute, params: { query:, variables:, operationName: operation_name }

        expect(response).to have_http_status(:internal_server_error)
        parsed_response = response.parsed_body || {}

        # Adjusted to match the actual response structure
        expect(parsed_response).to have_key('error') # Check if 'error' key is present
        expect(parsed_response['error']['message']).to eq('Some error')
        expect(parsed_response['error']['backtrace']).to be_present
      end
    end

    context 'when an error occurs in non-development environment' do
      before do
        allow(Rails).to receive(:env).and_return(ActiveSupport::StringInquirer.new('production'))
        allow(MealMatchSchema).to receive(:execute).and_raise(StandardError.new('Some error'))
      end

      it 'raises the error' do
        expect do
          post :execute, params: { query:, variables:, operationName: operation_name }
        end.to raise_error(StandardError, 'Some error')
      end
    end
  end
end
