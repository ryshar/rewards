class RewardsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @reward = rewards(:one)
    @user = users(:alice)
    @user.regenerate_token
  end

  test "should get index" do
    get rewards_url, headers: auth_headers(@user), as: :json
    assert_response :success

    rewards_data = JSON.parse(response.body)
    assert rewards_data.is_a?(Array)

    first_reward = rewards_data.first
    assert_includes first_reward.keys, "id"
    assert_includes first_reward.keys, "name"
    assert_includes first_reward.keys, "description"
    assert_includes first_reward.keys, "cost"
  end

  test "should order rewards by cost ascending" do
    get rewards_url, headers: auth_headers(@user), as: :json
    assert_response :success

    rewards_data = JSON.parse(response.body)
    costs = rewards_data.map { |r| r["cost"] }

    assert_equal costs.sort, costs
  end

  private

  def auth_headers(user)
    { "Authorization" => "Bearer #{user.token}" }
  end
end
