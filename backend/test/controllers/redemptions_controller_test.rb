class RedemptionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @redemption = redemptions(:one)
    @user = users(:alice)
    @user_with_low_points = users(:carol)
    @reward = rewards(:one)
    @expensive_reward = rewards(:three)

    @user.regenerate_token
    @user_with_low_points.regenerate_token
  end

  test "should get user's redemptions when authenticated" do
    get redemptions_url, headers: auth_headers(@user), as: :json
    assert_response :success

    redemptions_data = JSON.parse(response.body)
    assert redemptions_data.is_a?(Array)


    first_redemption = redemptions_data.first
    assert_includes first_redemption.keys, "reward"
    assert_includes first_redemption["reward"].keys, "name"
  end

  test "should require authentication for index" do
    get redemptions_url, as: :json
    assert_response :unauthorized
  end

  test "should create redemption with sufficient points" do
    original_balance = @user.point_balance

    assert_difference("Redemption.count") do
      post redemptions_url,
           params: { redemption: { reward_id: @reward.id } },
           headers: auth_headers(@user),
           as: :json
    end

    assert_response :created

    redemption_data = JSON.parse(response.body)
    assert_includes redemption_data.keys, "reward"
    assert_equal @reward.name, redemption_data["reward"]["name"]

    @user.reload
    assert_equal original_balance - @reward.cost, @user.point_balance
  end

  test "should require authentication for create" do
    assert_no_difference("Redemption.count") do
      post redemptions_url,
           params: { redemption: { reward_id: @reward.id } },
           as: :json
    end

    assert_response :unauthorized
  end

  test "should handle insufficient points" do
    assert_no_difference("Redemption.count") do
      post redemptions_url,
           params: { redemption: { reward_id: @expensive_reward.id } },
           headers: auth_headers(@user_with_low_points),
           as: :json
    end

    assert_response :unprocessable_entity

    error_data = JSON.parse(response.body)
    assert_equal "Insufficient points", error_data["error"]

    @user_with_low_points.reload
    assert_equal 50, @user_with_low_points.point_balance
  end

  test "should handle non-existent reward" do
    assert_no_difference("Redemption.count") do
      post redemptions_url,
           params: { redemption: { reward_id: 99999 } },
           headers: auth_headers(@user),
           as: :json
    end

    assert_response :not_found

    error_data = JSON.parse(response.body)
    assert_equal "Reward not found", error_data["error"]

    @user.reload
    assert_equal 1000, @user.point_balance
  end

  test "should require reward_id parameter" do
    assert_no_difference("Redemption.count") do
      post redemptions_url,
           params: { redemption: {} },
           headers: auth_headers(@user),
           as: :json
    end

    assert_response :bad_request
  end


  test "should return redemptions ordered by creation date desc" do
    first_redemption = Redemption.create_for!(user: @user, reward: @reward)
    second_redemption = Redemption.create_for!(user: @user, reward: @reward)
    second_redemption.update!(created_at: 1.minute.from_now)

    get redemptions_url, headers: auth_headers(@user), as: :json
    assert_response :success

    redemptions_data = JSON.parse(response.body)
    redemption_ids = redemptions_data.map { |r| r["id"] }

    assert_equal second_redemption.id, redemption_ids.first
    assert_equal first_redemption.id, redemption_ids.second
  end

  private

  def auth_headers(user)
    { "Authorization" => "Bearer #{user.token}" }
  end
end
