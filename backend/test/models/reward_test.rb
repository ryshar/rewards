require "test_helper"

class RewardTest < ActiveSupport::TestCase
  def setup
    @reward = rewards(:one)
  end

  test "should be valid with valid attributes" do
    assert @reward.valid?
  end

  test "should require name" do
    @reward.name = nil
    assert_not @reward.valid?
    assert_includes @reward.errors[:name], "can't be blank"
  end

  test "should require description" do
    @reward.description = nil
    assert_not @reward.valid?
    assert_includes @reward.errors[:description], "can't be blank"
  end

  test "should require cost" do
    @reward.cost = nil
    assert_not @reward.valid?
    assert_includes @reward.errors[:cost], "can't be blank"
  end

  test "should not allow zero cost" do
    @reward.cost = 0
    assert_not @reward.valid?
    assert_includes @reward.errors[:cost], "must be greater than 0"
  end

  test "should not allow negative cost" do
    @reward.cost = -10
    assert_not @reward.valid?
    assert_includes @reward.errors[:cost], "must be greater than 0"
  end

  test "should allow positive cost" do
    @reward.cost = 50
    assert @reward.valid?
  end
end
