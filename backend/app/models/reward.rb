class Reward < ApplicationRecord
  has_many :redemptions

  validates :name, presence: true
  validates :description, presence: true
  validates :cost, presence: true, numericality: { greater_than: 0 }
end
