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

  describe 'POST #create' do
    context 'valid' do
      it 'creates a room' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          name: 'CPW room',
          public: false
        }

        expect(user.reload.rooms.size).to eql(3)

        get :create, user_id: user.id, room: params, format: :json

        room = Room.last

        expected_response = {
          room: {
            id: room.id,
            name: 'CPW room',
            public: false
          }
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(user.reload.rooms.size).to eql(4)
      end
    end

    context 'invalid' do
      it 'creates room without params' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

          params = {
            name: '',
            public: false
          }

          expect(user.reload.rooms.size).to eql(3)

          get :create, user_id: user.id, room: params, format: :json

          expected_response = {
            errors: {
              name: ["can't be blank"]
            }
          }

          expect(response.body).to eql(expected_response.to_json)
          expect(user.reload.rooms.size).to eql(3)
      end
    end
  end
end
