alice = User.create!(
  name: 'Alice',
  email: 'alice@example.com',
  point_balance: 1000
)

bob = User.create!(
  name: 'Bob',
  email: 'bob@example.com',
  point_balance: 450
)

carol = User.create!(
  name: 'Carol',
  email: 'carol@example.com',
  point_balance: 50
)

Reward.create!([
  {
    name: '10% Off',
    description: 'Get 10% off your next purchase',
    cost: 100
  },
  {
    name: '$5 Off',
    description: 'Get $5 off your next purchase',
    cost: 250
  },
  {
    name: 'BOGO',
    description: 'Buy one get one free',
    cost: 500
  }
])
