class RedemptionsController < ApplicationController
  def index
    @redemptions = current_user.redemptions.includes(:reward).order(created_at: :desc)
    render json: @redemptions, include: { reward: { only: :name } }
  end

  def create
    reward = Reward.find(redemption_params[:reward_id])
    redemption = Redemption.create_for!(user: current_user, reward: reward)
    render json: redemption, status: :created, include: { reward: { only: :name } }
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Reward not found" }, status: :not_found
  rescue Redemption::InsufficientPoints => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private
    def redemption_params
      params.require(:redemption).permit(:reward_id)
    end
end
