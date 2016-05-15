require 'rails_helper'

describe Users::RegistrationsController do

  before(:each) do
    @request.env['devise.mapping'] = Devise.mappings[:api_v1_user]
  end

  describe 'POST #create' do
    context 'valid' do
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

    context 'not valid' do
      context 'email is already taken' do
        let!(:user) { FactoryGirl.create(:user, email: 'johndoe@email.com') }

        it 'does not create user as email is the same' do
          post :create, {
            api_v1_user: {
              first_name: 'John',
              last_name: 'Doe',
              email: 'johndoe@email.com',
              password: '123123123',
              password_confirmation: '123123123'
            }
          }

          expected_reponse = {
            error: {
              email: ['has already been taken']
            }
          }

          expect(response.body).to eql(expected_reponse.to_json)
          expect(User.count).to eql(1)
        end
      end
    end

    context 'attributes are not present' do
      it 'sends cant be blank error' do
        post :create, {
          api_v1_user: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: ''
          }
        }

        expected_reponse = {
          error: {
            email: ["can't be blank"],
            password: ["can't be blank"],
            first_name: ["can't be blank"],
            last_name: ["can't be blank"]
          }
        }

        expect(response.body).to eql(expected_reponse.to_json)
        expect(User.count).to eql(0)
      end
    end
  end

  describe 'PUT #update' do
    context 'valid' do
      let!(:user) { FactoryGirl.create(:user, email: 'johndoe@email.com', first_name: 'John', last_name: 'Doe', password: '123123123', password_confirmation: '123123123') }
      let!(:api_key) { FactoryGirl.create(:api_key, user: user, expires_at: Time.now + 7.days) }

      it 'updates user and send user info and token' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        antique_password = user.encrypted_password

        expect(user.first_name).to eql('John')
        expect(user.last_name).to eql('Doe')

        put :update, {
          api_v1_user: {
            first_name: 'Jonhson',
            last_name: 'Doan',
            current_password: '123123123',
            password: '321321321',
            password_confirmation: '321321321'
          }
        }

        expected_reponse = {
          user: {
            first_name: 'Jonhson',
            last_name: 'Doan',
            email: 'johndoe@email.com'
          },
          api_key: api_key.token
        }

        expect(response.body).to eql(expected_reponse.to_json)
        expect(user.reload.encrypted_password).not_to eql(antique_password)
        expect(user.reload.first_name).to eql('Jonhson')
        expect(user.reload.last_name).to eql('Doan')
      end
    end
  end
end