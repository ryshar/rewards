class UsersController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :index, :login ]

  def index
    users = User.select(:id, :name, :email)
    render json: users
  end

  def me
    render json: current_user, only: [ :id, :name, :email, :point_balance ]
  end

  def login
    user = User.find_by(id: params.require(:id))
    if user
      user.regenerate_token
      render json: { token: user.token }
    else
      render json: { error: "User not found" }, status: :not_found
    end
  end

  def logout
    current_user.update!(token: nil)
    head :no_content
  end
end
