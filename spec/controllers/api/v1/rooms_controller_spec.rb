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

      get :index, format: :json

      expected_response = {
        rooms: [
          {
            id: room1.id,
            name: room1.name,
            public: room1.public,
            user: {
              id: room1.user.id,
              first_name: room1.user.first_name,
              last_name: room1.user.last_name,
              email: room1.user.email
            }
          },
          {
            id: room2.id,
            name: room2.name,
            public: room2.public,
            user: {
              id: room2.user.id,
              first_name: room2.user.first_name,
              last_name: room2.user.last_name,
              email: room2.user.email
            }
          },
          {
            id: room3.id,
            name: room3.name,
            public: room3.public,
            user: {
              id: room3.user.id,
              first_name: room3.user.first_name,
              last_name: room3.user.last_name,
              email: room3.user.email
            }
          }
        ]
      }

      expect(response.body).to eql(expected_response.to_json)
      expect(response.status).to eql(200)
    end
  end

  describe 'GET #search' do
    it 'gets first 5 rooms if no term is passed' do
      request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

      get :search, format: :json

      expected_response = {
        rooms: [
          {
            id: room1.id,
            name: room1.name,
            public: room1.public,
            user: {
              id: room1.user.id,
              first_name: room1.user.first_name,
              last_name: room1.user.last_name,
              email: room1.user.email
            }
          },
          {
            id: room2.id,
            name: room2.name,
            public: room2.public,
            user: {
              id: room2.user.id,
              first_name: room2.user.first_name,
              last_name: room2.user.last_name,
              email: room2.user.email
            }
          },
          {
            id: room3.id,
            name: room3.name,
            public: room3.public,
            user: {
              id: room3.user.id,
              first_name: room3.user.first_name,
              last_name: room3.user.last_name,
              email: room3.user.email
            }
          }
        ]
      }

      expect(response.body).to eql(expected_response.to_json)
      expect(response.status).to eql(200)
    end

    it 'gets result of search' do
      request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

      params = {
        term: 'Room 1',
        format: :json
      }

      get :search, params

      expected_response = {
        rooms: [
          {
            id: room1.id,
            name: room1.name,
            public: room1.public,
            user: {
              id: room1.user.id,
              first_name: room1.user.first_name,
              last_name: room1.user.last_name,
              email: room1.user.email
            }
          }
        ]
      }

      expect(response.body).to eql(expected_response.to_json)
      expect(response.status).to eql(200)
    end
  end

  describe 'GET #participating_rooms' do
    let!(:user2) { FactoryGirl.create(:user, email: 'janedoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
    let!(:api_key2)    { FactoryGirl.create(:api_key, user: user2, expires_at: Time.now + 7.days) }

    before(:each) do
      room1.participants << user2
    end

    it 'sends users participating rooms' do
      request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key2.token}"

      get :participating_rooms, format: :json

      expected_response = {
        rooms: [
          {
            id: room1.id,
            name: room1.name,
            public: room1.public,
            user: {
              id: room1.user.id,
              first_name: room1.user.first_name,
              last_name: room1.user.last_name,
              email: room1.user.email
            }
          }
        ]
      }

      expect(response.body).to eql(expected_response.to_json)
      expect(response.status).to eql(200)
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

        get :create, room: params, format: :json

        room = Room.last

        expected_response = {
          room: {
            id: room.id,
            name: 'CPW room',
            public: false,
            user: {
              id: room.user.id,
              first_name: room.user.first_name,
              last_name: room.user.last_name,
              email: room.user.email
            }
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

        get :create, room: params, format: :json

        expected_response = {
          errors: {
            name: ["can't be blank"]
          }
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(user.reload.rooms.size).to eql(3)
      end

      it 'api_key is invalid' do
        api_key.expires_at = Time.now - 7.days
        api_key.save

        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          name: 'CPW room',
          public: false
        }

        expect(user.reload.rooms.size).to eql(3)

        get :create, room: params, format: :json

        expected_response = {
          error: 'Not authorized'
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(401)
        expect(user.reload.rooms.size).to eql(3)
      end
    end
  end

  describe 'GET #show' do
    context 'valid' do
      it 'gets one room information' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :show, id: room1.id, format: :json

        expected_response = {
          room: {
            id: room1.id,
            name: room1.name,
            public: room1.public,
            user: {
              id: room1.user.id,
              first_name: room1.user.first_name,
              last_name: room1.user.last_name,
              email: room1.user.email
            }
          }
        }

        expect(response.body).to eql(expected_response.to_json)
      end
    end

    context 'invalid' do
      it 'api_key is invalid' do
        api_key.expires_at = Time.now - 7.days
        api_key.save

        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :show, id: room1.id, format: :json

        expected_response = {
          error: 'Not authorized'
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(401)
      end
    end
  end

  describe 'PUT #update' do
    context 'valid' do
      it 'updates room information' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        expect(room1.name).to eql('Room 1')

        put :update, id: room1.id, room: {name: 'PDA room', public: true}, format: :json

        expected_response = {
          room: {
            id: room1.id,
            name: 'PDA room',
            public: true,
            user: {
              id: room1.user.id,
              first_name: room1.user.first_name,
              last_name: room1.user.last_name,
              email: room1.user.email
            }
          }
        }

        expect(room1.reload.name).to eql('PDA room')
        expect(room1.public).to eql(true)
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end

    context 'invalid' do
      it 'api_key is invalid' do
        api_key.expires_at = Time.now - 7.days
        api_key.save
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        expect(room1.name).to eql('Room 1')

        put :update, id: room1.id, room: {name: 'PDA room', public: true}, format: :json

        expected_response = {
          error: 'Not authorized'
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(401)
      end

      it 'attributes are empty' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        expect(room1.name).to eql('Room 1')

        put :update, id: room1.id, room: {name: ''}, format: :json

        expected_response = {
          errors: {
            name: ["can't be blank"]
          }
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(400)
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'valid' do
      it 'deletes one room' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        expect(user.rooms.size).to eql(3)

        expected_response = {
          room: {
            id: room1.id,
            name: room1.name,
            public: room1.public,
            user: {
              id: room1.user.id,
              first_name: room1.user.first_name,
              last_name: room1.user.last_name,
              email: room1.user.email
            }
          }
        }

        delete :destroy, id: room1.id, format: :json

        expect(user.reload.rooms.size).to eql(2)
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end

    context 'invalid' do
      it 'api_key is invalid' do
        api_key.expires_at = Time.now - 7.days
        api_key.save
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        delete :destroy, id: room1.id, format: :json

        expected_response = {
          error: 'Not authorized'
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(401)
      end
    end
  end
end
