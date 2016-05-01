require 'rails_helper'

describe Users::SessionsController do
  let!(:user) { FactoryGirl.create(:user, email: 'johndoe@email.com', password: '123123123', password_confirmation: '123123123') }
  let!(:api_key) { FactoryGirl.create(:api_key, user: user) }

  before(:each) do
    @request.env['devise.mapping'] = Devise.mappings[:api_v1_user]
  end

  describe 'POST #create' do
    context 'user exists' do
      it 'sends user and token' do
        post :create, {
          api_v1_user: {
            email: 'johndoe@email.com',
            password: '123123123',
            password_confirmation: '123123123'
          }
        }

        user = User.last
        api_key = user.api_keys.last

        expected_reponse = {
          user: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          },
          api_key: api_key.token
        }

        expect(response.body).to eql(expected_reponse.to_json)
      end
    end

    context 'user doesnt exist' do
      it 'returns 404 response' do
        post :create, {
          api_v1_user: {
            email: 'janedoe@email.com',
            password: '123123123',
            password_confirmation: '123123123'
          }
        }

        expected_response = {
          error: 'email or password is wrong'
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(404)
      end
    end

    context 'api_key has expired' do
      it 'renew api_key' do
        api_key = ApiKey.last
        api_key.expires_at = Time.now - 7.days
        api_key.save

        post :create, {
            api_v1_user: {
              email: 'johndoe@email.com',
              password: '123123123',
              password_confirmation: '123123123'
            }
          }

        data = JSON.parse(response.body)

        expect(data[:api_key]).not_to eql(api_key.token)
      end
    end
  end
end