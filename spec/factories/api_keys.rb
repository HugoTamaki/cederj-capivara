FactoryGirl.define do
  factory :api_key do
    secret "MyString"
    key "MyString"
    expires_at "2016-04-28 21:28:58"
    user_id 1
  end
end
