require 'rails_helper'

describe Users::RegistrationsController do

  before(:each) do
    @request.env['devise.mapping'] = Devise.mappings[:api_v1_user]
  end

  describe 'POST #create' do
    it 'creates user and send user info and token' do
      post :create, {
        api_v1_user: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'johndoe@email.com',
          password: '123123123',
          password_confirmation: '123123123'
        }
      }

      user = User.last
      api_key = ApiKey.last
      expected_reponse = {
        user: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'johndoe@email.com'
        },
        api_key: api_key.token
      }

      expect(user.first_name).to eql('John')
      expect(user.last_name).to eql('Doe')
      expect(user.email).to eql('johndoe@email.com')
      expect(user.api_keys.count).to eql(1)
      expect(response.body).to eql(expected_reponse.to_json)
    end
  end
end