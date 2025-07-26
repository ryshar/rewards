class User < ApplicationRecord
  has_secure_token
  has_many :redemptions

  validates :email, presence: true, uniqueness: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :point_balance, presence: true, numericality: { greater_than_or_equal_to: 0 }
end
