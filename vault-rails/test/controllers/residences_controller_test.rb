require "test_helper"

class ResidencesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get residences_index_url
    assert_response :success
  end
end
