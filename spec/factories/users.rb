FactoryGirl.define do
  factory :user do
    first_name 'John'
    last_name 'Doe'
    email 'johndoe@email.com'
    password '123123123'
    password_confirmation '123123123'
  end
end
