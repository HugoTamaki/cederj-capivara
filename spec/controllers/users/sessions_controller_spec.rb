require 'rails_helper'

describe Users::SessionsController do
  let!(:computacao) { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computação') }
  let!(:pda) { FactoryGirl.create(:discipline, name: 'PDA', description: 'discipline desc', course: computacao) }
  let!(:cpw) { FactoryGirl.create(:discipline, name: 'CPW', description: 'discipline desc', course: computacao) }
  let!(:user) { FactoryGirl.create(:user, email: 'johndoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:api_key) { FactoryGirl.create(:api_key, user: user, expires_at: Time.now + 7.days) }

  before(:each) do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  describe 'POST #create' do
    context 'user exists' do
      before(:each) do
        user.set_disciplines
      end

      it 'sends user and token' do
        post :create, {
          user: {
            email: 'johndoe@email.com',
            password: '123123123',
            password_confirmation: '123123123'
          }
        }

        user = User.last
        api_key = user.api_keys.last
        user_disciplines = user.user_disciplines

        expected_reponse = {
          user: {
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@email.com',
            disciplines: [
              {
                id: pda.id,
                ud_id: user_disciplines[0].id,
                name: pda.name,
                description: pda.description,
                status: 'incomplete'
              },
              {
                id: cpw.id,
                ud_id: user_disciplines[1].id,
                name: cpw.name,
                description: cpw.description,
                status: 'incomplete'
              }
            ]
          },
          api_key: api_key.token
        }

        expect(response.body).to eql(expected_reponse.to_json)
      end
    end

    context 'user doesnt exist' do
      it 'returns 404 response' do
        post :create, {
          user: {
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
            user: {
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

  describe 'DELETE #destroy' do
    context 'ApiKey is not found' do
      it 'send 404 status' do
        api_key.destroy

        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"
        delete :destroy

        data = JSON.parse(response.body)

        expect(data).to eql({
            'error' => 'Bad credentials'
          })
        expect(response.status).to eql(401)
      end
    end

    context 'ApiKey is found' do
      it 'destroys ApiKey' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"
        delete :destroy

        data = JSON.parse(response.body)

        expect(data).to eql({
            'message' => 'Session cleared'
          })
        expect(response.status).to eql(200)
      end
    end

    context 'ApiKey is expired' do
      it 'sends 404 status' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"
        api_key.expires_at = Time.now - 7.days
        api_key.save

        delete :destroy

        data = JSON.parse(response.body)

        expect(data).to eql({
            'error' => 'Bad credentials'
          })
        expect(response.status).to eql(401)
      end
    end
  end
end