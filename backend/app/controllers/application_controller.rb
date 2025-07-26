class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate_user!

  private

  def authenticate_user!
    authenticate_or_request_with_http_token do |token, _options|
      @current_user = User.find_by(token: token)
    end
  end

  def current_user
    @current_user ||= nil
  end
end
