require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:alice)
    @user.regenerate_token
  end

  test "should get index without authentication" do
    get users_url, as: :json
    assert_response :success

    users_data = JSON.parse(response.body)
    assert users_data.is_a?(Array)

    first_user = users_data.first
    assert_includes first_user.keys, "id"
    assert_includes first_user.keys, "name"
    assert_includes first_user.keys, "email"
    assert_not_includes first_user.keys, "point_balance"
    assert_not_includes first_user.keys, "token"
  end

  test "should get current user info when authenticated" do
    get me_url, headers: auth_headers(@user), as: :json
    assert_response :success

    user_data = JSON.parse(response.body)
    assert_equal @user.id, user_data["id"]
    assert_equal @user.name, user_data["name"]
    assert_equal @user.email, user_data["email"]
    assert_equal @user.point_balance, user_data["point_balance"]
    assert_not_includes user_data.keys, "token"
  end

  test "should require authentication for me action" do
    get me_url, as: :json
    assert_response :unauthorized
  end

  test "should login with valid user id" do
    post login_url, params: { id: @user.id }, as: :json
    assert_response :success

    response_data = JSON.parse(response.body)
    assert_includes response_data.keys, "token"
    assert_not_nil response_data["token"]

    @user.reload
    assert_equal @user.token, response_data["token"]
  end

  test "should return not found for invalid user id" do
    post login_url, params: { id: 99999 }, as: :json
    assert_response :not_found

    error_data = JSON.parse(response.body)
    assert_equal "User not found", error_data["error"]
  end

  test "should require id parameter for login" do
    post login_url, params: {}, as: :json
    assert_response :bad_request
  end

  test "should login without authentication required" do
    post login_url, params: { id: @user.id }, as: :json
    assert_response :success
  end

  test "should clear token when logged out" do
    delete logout_url, headers: auth_headers(@user), as: :json
    assert_response :no_content

    @user.reload
    assert_nil @user.token
  end

  test "should require authentication for logout" do
    delete logout_url, as: :json
    assert_response :unauthorized
  end

  private

  def auth_headers(user)
    { "Authorization" => "Bearer #{user.token}" }
  end

  def me_url
    "/users/me"
  end

  def login_url
    "/users/login"
  end

  def logout_url
    "/users/logout"
  end
end
