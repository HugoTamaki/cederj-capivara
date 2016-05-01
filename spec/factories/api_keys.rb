FactoryGirl.define do
  factory :api_key do
    secret "650f80eeeb0a4618a4d0a338b9c2dbbb"
    key "1f3d747dc8a24661a449fff0c0451d3c"
    expires_at Time.now + 7.days
    user_id 1
  end
end
