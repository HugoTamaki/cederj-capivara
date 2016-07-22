require 'rails_helper'

describe Api::V1::RoomEntryRequestsController do
  render_views

  let!(:computacao) { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computacao') }
  let!(:sender)     { FactoryGirl.create(:user, email: 'johndoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:receiver)    { FactoryGirl.create(:user, email: 'janedoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:api_key)    { FactoryGirl.create(:api_key, user: sender, expires_at: Time.now + 7.days) }
  let!(:api_key2)    { FactoryGirl.create(:api_key, user: receiver, expires_at: Time.now + 7.days) }
  let!(:room)      { FactoryGirl.create(:room, user: receiver, name: 'Room 1', public: false) }

  let!(:room_entry_request) { FactoryGirl.create(:room_entry_request, sender: sender, receiver: receiver, room: room) }

  describe 'GET #index' do
    describe 'valid api_key' do
      it 'sends received room_requests' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key2.token}"

        get :index, format: :json

        expected_response = {
          room_entry_requests: [
            {
              id: room_entry_request.id,
              sender_id: sender.id,
              receiver_id: receiver.id,
              room: {
                id: room.id,
                name: room.name,
                public: room.public,
                user: {
                  id: room.user.id,
                  first_name: room.user.first_name,
                  last_name: room.user.last_name,
                  email: room.user.email,
                  room_ids: room.user.room_ids
                }
              }
            }
          ]
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end

    describe 'invalid api_key' do
      before(:each) do
        api_key2.expires_at = Time.now - 7.days
        api_key2.save
      end

      it 'sends not authorized error' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key2.token}"

        get :index, format: :json

        expected_response = {
          error: 'Not authorized'
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(401)
      end
    end
  end

  describe 'POST #create' do
    describe 'sends all params' do
      it 'creates entry request successfully' do
        expect(RoomEntryRequest.count).to eql(1)

        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          room_id: room.id,
          receiver_id: receiver.id
        }

        post :create, room_entry_request: params, format: :json

        room_entry_request = RoomEntryRequest.last

        expected_response = {
          room_entry_request: {
            id: room_entry_request.id,
            sender_id: sender.id,
            receiver_id: receiver.id,
            room: {
              id: room.id,
              name: room.name,
              public: room.public,
              user: {
                id: room.user.id,
                first_name: room.user.first_name,
                last_name: room.user.last_name,
                email: room.user.email,
                room_ids: room.user.room_ids
              }
            }
          }
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
        expect(RoomEntryRequest.count).to eql(2)
      end
    end

    describe 'lacks room_id' do
      it 'sends room_id cant be blank error' do
        expect(RoomEntryRequest.count).to eql(1)

        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          receiver_id: receiver.id
        }

        post :create, room_entry_request: params, format: :json

        expected_response = {
          errors:{
            room_id: ["can't be blank"]
          }
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(400)
        expect(RoomEntryRequest.count).to eql(1)
      end
    end

    describe 'lacks receiver_id' do
      it 'sends receiver_id cant be blank error' do
        expect(RoomEntryRequest.count).to eql(1)

        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          room_id: room.id
        }

        post :create, room_entry_request: params, format: :json

        expected_response = {
          errors:{
            receiver_id: ["can't be blank"]
          }
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(400)
        expect(RoomEntryRequest.count).to eql(1)
      end
    end
  end
end
