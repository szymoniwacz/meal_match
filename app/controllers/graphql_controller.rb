# frozen_string_literal: true

class GraphqlController < ApplicationController
  # If accessing from outside this domain, nullify the session
  # This allows for outside API access while preventing CSRF attacks
  protect_from_forgery with: :null_session

  def execute
    variables = params[:variables] || {}
    query = params[:query]
    operation_name = params[:operationName]
    context = {
      current_user:,
      cookies:,
    }
    result = MealMatchSchema.execute(query, variables:, context:, operation_name:)
    render json: result
  rescue StandardError => e
    raise e unless Rails.env.development?

    handle_error_in_development(e)
  end

  private

  def handle_error_in_development(e)
    logger.error e.message
    logger.error e.backtrace.join("\n")
    render json: { error: { message: e.message, backtrace: e.backtrace }, data: {} }, status: :internal_server_error
  end
end
