require "test_helper"

class RedemptionTest < ActiveSupport::TestCase
  def setup
    @redemption = redemptions(:one)
    @user = users(:alice)
    @reward = rewards(:one)
  end

  test "should require amount" do
    @redemption.amount = nil
    assert_not @redemption.valid?
    assert_includes @redemption.errors[:amount], "can't be blank"
  end

  test "should not allow zero amount" do
    @redemption.amount = 0
    assert_not @redemption.valid?
    assert_includes @redemption.errors[:amount], "must be greater than 0"
  end

  test "should not allow negative amount" do
    @redemption.amount = -10
    assert_not @redemption.valid?
    assert_includes @redemption.errors[:amount], "must be greater than 0"
  end

  test "should allow positive amount" do
    @redemption.amount = 50
    assert @redemption.valid?
  end

  test "should not allow non-numeric amount" do
    @redemption.amount = "invalid"
    assert_not @redemption.valid?
    assert_includes @redemption.errors[:amount], "is not a number"
  end

  test "should belong to user" do
    assert_respond_to @redemption, :user
    assert_kind_of User, @redemption.user
  end

  test "should belong to reward" do
    assert_respond_to @redemption, :reward
    assert_kind_of Reward, @redemption.reward
  end

  test "should create redemption with sufficient points" do
    user = users(:alice)
    reward = rewards(:one)

    assert_difference "Redemption.count", 1 do
      redemption = Redemption.create_for!(user: user, reward: reward)

      assert_equal user, redemption.user
      assert_equal reward, redemption.reward
      assert_equal reward.cost, redemption.amount
    end
  end

  test "should deduct points from user balance" do
    user = users(:alice)
    reward = rewards(:one)
    original_balance = user.point_balance

    Redemption.create_for!(user: user, reward: reward)
    user.reload

    assert_equal original_balance - reward.cost, user.point_balance
  end

  test "should raise InsufficientPoints when user has insufficient points" do
    user = users(:carol)
    reward = rewards(:one)

    assert_raises Redemption::InsufficientPoints do
      Redemption.create_for!(user: user, reward: reward)
    end
  end

  test "should not deduct points when redemption fails" do
    user = users(:carol)
    reward = rewards(:one)
    original_balance = user.point_balance

    exception = assert_raises Redemption::InsufficientPoints do
      Redemption.create_for!(user: user, reward: reward)
    end

    user.reload
    assert_equal original_balance, user.point_balance
  end
end
