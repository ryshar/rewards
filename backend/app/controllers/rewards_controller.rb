class RewardsController < ApplicationController
  def index
    @rewards = Reward.order(cost: :asc)
    render json: @rewards
  end
end
