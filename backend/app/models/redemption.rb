class Redemption < ApplicationRecord
  class InsufficientPoints < StandardError; end

  belongs_to :user
  belongs_to :reward

  validates :amount, presence: true, numericality: { greater_than: 0 }

  def self.create_for!(user:, reward:)
    user.with_lock do
      if user.point_balance < reward.cost
        raise InsufficientPoints, "Insufficient points"
      end

      redemption = create!(
        user: user,
        reward: reward,
        amount: reward.cost
      )

      user.decrement!(:point_balance, reward.cost)
      redemption
    end
  end
end
