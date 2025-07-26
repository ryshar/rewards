require "test_helper"

class UserTest < ActiveSupport::TestCase
  def setup
    @user = users(:alice)
  end

  test "should be valid with valid attributes" do
    assert @user.valid?
  end

  test "should require email" do
    @user.email = nil
    assert_not @user.valid?
    assert_includes @user.errors[:email], "can't be blank"
  end

  test "should require email to be unique" do
    duplicate_user = User.new(
      name: "Another User",
      email: @user.email,
      point_balance: 50
    )
    assert_not duplicate_user.valid?
    assert_includes duplicate_user.errors[:email], "has already been taken"
  end

  test "should validate email format" do
    @user.email = "invalid"
    assert_not @user.valid?, "invalid should be invalid"
    assert_includes @user.errors[:email], "is invalid"
  end

  test "should require point_balance" do
    @user.point_balance = nil
    assert_not @user.valid?
    assert_includes @user.errors[:point_balance], "can't be blank"
  end

  test "should not allow negative point_balance" do
    @user.point_balance = -10
    assert_not @user.valid?
    assert_includes @user.errors[:point_balance], "must be greater than or equal to 0"
  end

  test "should allow zero point_balance" do
    @user.point_balance = 0
    assert @user.valid?
  end

  test "should allow positive point_balance" do
    @user.point_balance = 100
    assert @user.valid?
  end

  test "should generate token on creation" do
    user = User.create!(
      name: "New User",
      email: "new@example.com",
      point_balance: 0
    )

    assert_not_nil user.token
  end
end
