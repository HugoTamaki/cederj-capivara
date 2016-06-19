require 'rails_helper'

describe Api::V1::RoomsController do
  render_views

  let!(:computacao) { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computacao') }
  let!(:user)       { FactoryGirl.create(:user, email: 'johndoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:api_key)    { FactoryGirl.create(:api_key, user: user, expires_at: Time.now + 7.days) }
  let!(:room1)      { FactoryGirl.create(:room, user: user, name: 'Room 1', public: false) }
  let!(:room2)      { FactoryGirl.create(:room, user: user, name: 'Room 2', public: false) }
  let!(:room3)      { FactoryGirl.create(:room, user: user, name: 'Room 3', public: false) }

  describe 'GET #index' do
    context 'valid' do
      it 'sends all users room' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :index, user_id: user.id, format: :json

        expected_response = {
          rooms: [
            {
              id: room1.id,
              name: room1.name,
              public: room1.public
            },
            {
              id: room2.id,
              name: room2.name,
              public: room2.public
            },
            {
              id: room3.id,
              name: room3.name,
              public: room3.public
            }
          ]
        }

        expect(response.body).to eql(expected_response.to_json)
      end
    end

    context 'invalid' do

    end
  end
end
