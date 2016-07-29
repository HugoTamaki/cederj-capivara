require 'rails_helper'

describe Api::V1::RoomEntryRequestsController do
  render_views

  let!(:computacao) { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computacao') }
  let!(:sender)     { FactoryGirl.create(:user, email: 'johndoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:receiver)    { FactoryGirl.create(:user, email: 'janedoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:receiver2)  { FactoryGirl.create(:user, email: 'receiver2@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:receiver3)  { FactoryGirl.create(:user, email: 'receiver3@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:api_key)    { FactoryGirl.create(:api_key, user: sender, expires_at: Time.now + 7.days) }
  let!(:api_key2)    { FactoryGirl.create(:api_key, user: receiver, expires_at: Time.now + 7.days) }
  let!(:room)      { FactoryGirl.create(:room, user: receiver, name: 'Room 1', public: false) }
  let!(:room2)  { FactoryGirl.create(:room, user: receiver2, name: 'Room 2', public: false ) }
  let!(:room3)  { FactoryGirl.create(:room, user: receiver3, name: 'Room 3', public: false ) }

  let!(:room_entry_request) { FactoryGirl.create(:room_entry_request, sender: sender, receiver: receiver, room: room) }
  let!(:room_entry_request2) { FactoryGirl.create(:room_entry_request, sender: sender, receiver: receiver2, room: room2) }
  let!(:room_entry_request3) { FactoryGirl.create(:room_entry_request, sender: sender, receiver: receiver3, room: room3) }

  describe 'GET #index' do
    describe 'valid api_key' do
      it 'sends received room_requests' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key2.token}"

        get :index, format: :json

        expected_response = {
          room_entry_requests: [
            {
              id: room_entry_request.id,
              accepted: room_entry_request.accepted,
              sender: {
                id: room_entry_request.sender.id,
                first_name: room_entry_request.sender.first_name,
                last_name: room_entry_request.sender.last_name,
                email: room_entry_request.sender.email
              },
              receiver: {
                id: room_entry_request.receiver.id,
                first_name: room_entry_request.receiver.first_name,
                last_name: room_entry_request.receiver.last_name,
                email: room_entry_request.receiver.email
              }, 
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

  describe 'GET #sent_requests' do
    describe 'valid api_key' do
      it 'sends sent requests' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :sent_requests, format: :json

        expected_response = {
          room_entry_requests: [
            {
              id: room_entry_request.id,
              accepted: room_entry_request.accepted,
              sender: {
                id: room_entry_request.sender.id,
                first_name: room_entry_request.sender.first_name,
                last_name: room_entry_request.sender.last_name,
                email: room_entry_request.sender.email
              },
              receiver: {
                id: room_entry_request.receiver.id,
                first_name: room_entry_request.receiver.first_name,
                last_name: room_entry_request.receiver.last_name,
                email: room_entry_request.receiver.email
              },
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
            },
            {
              id: room_entry_request2.id,
              accepted: room_entry_request2.accepted,
              sender: {
                id: room_entry_request2.sender.id,
                first_name: room_entry_request2.sender.first_name,
                last_name: room_entry_request2.sender.last_name,
                email: room_entry_request2.sender.email
              },
              receiver: {
                id: room_entry_request2.receiver.id,
                first_name: room_entry_request2.receiver.first_name,
                last_name: room_entry_request2.receiver.last_name,
                email: room_entry_request2.receiver.email
              }, 
              room: {
                id: room2.id,
                name: room2.name,
                public: room2.public,
                user: {
                  id: room2.user.id,
                  first_name: room2.user.first_name,
                  last_name: room2.user.last_name,
                  email: room2.user.email,
                  room_ids: room2.user.room_ids
                }
              }
            },
            {
              id: room_entry_request3.id,
              accepted: room_entry_request3.accepted,
              sender: {
                id: room_entry_request3.sender.id,
                first_name: room_entry_request3.sender.first_name,
                last_name: room_entry_request3.sender.last_name,
                email: room_entry_request3.sender.email
              },
              receiver: {
                id: room_entry_request3.receiver.id,
                first_name: room_entry_request3.receiver.first_name,
                last_name: room_entry_request3.receiver.last_name,
                email: room_entry_request3.receiver.email
              }, 
              room: {
                id: room3.id,
                name: room3.name,
                public: room3.public,
                user: {
                  id: room3.user.id,
                  first_name: room3.user.first_name,
                  last_name: room3.user.last_name,
                  email: room3.user.email,
                  room_ids: room3.user.room_ids
                }
              }
            }
          ]
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end

    it 'sends only invitations with determined room_id' do
      request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

      params = {
        room_id: room.id,
        format: :json
      }

      get :sent_requests, params

      expected_response = {
        room_entry_requests: [
          {
            id: room_entry_request.id,
            accepted: room_entry_request.accepted,
            sender: {
              id: room_entry_request.sender.id,
              first_name: room_entry_request.sender.first_name,
              last_name: room_entry_request.sender.last_name,
              email: room_entry_request.sender.email
            },
            receiver: {
              id: room_entry_request.receiver.id,
              first_name: room_entry_request.receiver.first_name,
              last_name: room_entry_request.receiver.last_name,
              email: room_entry_request.receiver.email
            },
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

    describe 'invalid api_key' do
      before(:each) do
        api_key.expires_at = Time.now - 7.days
        api_key.save
      end

      it 'sends not authorized error' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :sent_requests, format: :json

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
        expect(RoomEntryRequest.count).to eql(3)

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
            accepted: room_entry_request.accepted,
            sender: {
              id: room_entry_request.sender.id,
              first_name: room_entry_request.sender.first_name,
              last_name: room_entry_request.sender.last_name,
              email: room_entry_request.sender.email
            },
            receiver: {
              id: room_entry_request.receiver.id,
              first_name: room_entry_request.receiver.first_name,
              last_name: room_entry_request.receiver.last_name,
              email: room_entry_request.receiver.email
            },
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
        expect(RoomEntryRequest.count).to eql(4)
      end
    end

    describe 'lacks room_id' do
      it 'sends room_id cant be blank error' do
        expect(RoomEntryRequest.count).to eql(3)

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
        expect(RoomEntryRequest.count).to eql(3)
      end
    end

    describe 'lacks receiver_id' do
      it 'sends receiver_id cant be blank error' do
        expect(RoomEntryRequest.count).to eql(3)

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
        expect(RoomEntryRequest.count).to eql(3)
      end
    end
  end

  describe 'POST #accept' do
    
  end
end
