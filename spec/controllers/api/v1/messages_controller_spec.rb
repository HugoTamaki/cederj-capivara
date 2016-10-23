require 'rails_helper'

describe Api::V1::MessagesController do
  render_views

  let!(:computacao)  { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computacao') }
  let!(:user)        { FactoryGirl.create(:user, email: 'johndoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:api_key)     { FactoryGirl.create(:api_key, user: user, expires_at: Time.now + 7.days) }
  let!(:room1)       { FactoryGirl.create(:room, user: user, name: 'Room 1', public: false) }
  let!(:topic1)      { FactoryGirl.create(:topic, name:'Topic title 1', content: 'lorem ipsum lari lara', room: room1) }
  let!(:message1)    { FactoryGirl.create(:message, content: 'lorem ipsum lari lara 1', topic: topic1, user: user) }
  let!(:message2)    { FactoryGirl.create(:message, content: 'lorem ipsum lari lara 2', topic: topic1, user: user) }
  let!(:message3)    { FactoryGirl.create(:message, content: 'lorem ipsum lari lara 3', topic: topic1, user: user) }
  let!(:user2)       { FactoryGirl.create(:user, email: 'janedoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:room2)       { FactoryGirl.create(:room, user: user2, name: 'Room 2', public: false) }
  let!(:topic2)      { FactoryGirl.create(:topic, name:'Topic title 4', content: 'lorem ipsum lari lara', room: room2) }
  let!(:message4)    { FactoryGirl.create(:message, content: 'lorem ipsum lari lara 4', topic: topic2, user: user) }
  let!(:message5)    { FactoryGirl.create(:message, content: 'lorem ipsum lari lara 5', topic: topic2, user: user) }
  let!(:message6)    { FactoryGirl.create(:message, content: 'lorem ipsum lari lara 6', topic: topic2, user: user) }

  describe 'GET #index' do
    describe 'messages of user for a owning room topic' do
      it 'sends all topic messages' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :index, room_id: room1.id, topic_id: topic1.id, format: :json

        expected_response = {
          messages: [
            {
              id: message3.id,
              content: message3.content,
              topic_id: message3.topic.id,
              user: {
                id: message3.user.id,
                first_name: message3.user.first_name,
                last_name: message3.user.last_name,
                email: message3.user.email
              },
              created_at: message3.created_at.to_time.as_json,
              updated_at: message3.updated_at.to_time.as_json
            },
            {
              id: message2.id,
              content: message2.content,
              topic_id: message2.topic.id,
              user: {
                id: message2.user.id,
                first_name: message2.user.first_name,
                last_name: message2.user.last_name,
                email: message2.user.email
              },
              created_at: message2.created_at.to_time.as_json,
              updated_at: message2.updated_at.to_time.as_json
            },
            {
              id: message1.id,
              content: message1.content,
              topic_id: message1.topic.id,
              user: {
                id: message1.user.id,
                first_name: message1.user.first_name,
                last_name: message1.user.last_name,
                email: message1.user.email
              },
              created_at: message1.created_at.to_time.as_json,
              updated_at: message1.updated_at.to_time.as_json
            }
          ]
        }

        expect(user.rooms).to include(room1)
        expect(user.groups).not_to include(room2)
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end

    describe 'messages of user for a participating room topic' do
      before :each do
        room2.participants << user
      end

      it 'sends all messages of topic' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :index, room_id: room2.id, topic_id: topic2.id, format: :json

        expected_response = {
          messages: [
            {
              id: message6.id,
              content: message6.content,
              topic_id: message6.topic.id,
              user: {
                id: message6.user.id,
                first_name: message6.user.first_name,
                last_name: message6.user.last_name,
                email: message6.user.email
              },
              created_at: message6.created_at.to_time.as_json,
              updated_at: message6.updated_at.to_time.as_json
            },
            {
              id: message5.id,
              content: message5.content,
              topic_id: message5.topic.id,
              user: {
                id: message5.user.id,
                first_name: message5.user.first_name,
                last_name: message5.user.last_name,
                email: message5.user.email
              },
              created_at: message5.created_at.to_time.as_json,
              updated_at: message5.updated_at.to_time.as_json,
            },
            {
              id: message4.id,
              content: message4.content,
              topic_id: message4.topic.id,
              user: {
                id: message4.user.id,
                first_name: message4.user.first_name,
                last_name: message4.user.last_name,
                email: message4.user.email
              },
              created_at: message4.created_at.to_time.as_json,
              updated_at: message4.updated_at.to_time.as_json,
            }
          ]
        }

        expect(user.rooms).to include(room1)
        expect(user.groups).to include(room2)
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end

    describe 'messages of user for a room he dont participate or owns' do
      it 'sends unauthorized message' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :index, room_id: room2.id, topic_id: topic2.id, format: :json

        expected_response = {
          error: 'Forbidden'
        }

        expect(room2.participants).to match([])
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(403)
      end
    end
  end

  describe 'POST #create' do
    describe 'creates message for room user owns' do
      it 'creates message' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          content: 'lorem ipsum lala'
        }

        expect(topic1.messages.size).to eql(3)

        post :create, room_id: room1.id, topic_id: topic1.id, message: params, format: :json

        message = Message.last

        expected_response = {
          message: {
            id: message.id,
            content: message.content,
            topic_id: message.topic_id,
            user: {
              id: message.user.id,
              first_name: message.user.first_name,
              last_name: message.user.last_name,
              email: message.user.email
            }
          }
        }

        expect(user.rooms).to include(room1)
        expect(room2.participants).not_to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(topic1.reload.messages.size).to eql(4)
      end
    end

    describe 'creates message for room user participates' do
      before :each do
        room2.participants << user
      end

      it 'creates message' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          content: 'lorem ipsum lala'
        }

        expect(topic1.messages.size).to eql(3)

        post :create, room_id: room2.id, topic_id: topic2.id, message: params, format: :json

        message = Message.last

        expected_response = {
          message: {
            id: message.id,
            content: message.content,
            topic_id: message.topic_id,
            user: {
              id: message.user.id,
              first_name: message.user.first_name,
              last_name: message.user.last_name,
              email: message.user.email
            }
          }
        }

        expect(user.rooms).to include(room1)
        expect(room2.participants).to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(topic2.reload.messages.size).to eql(4)
      end
    end

    describe 'creates message for room user nor owns neither participates' do
      it 'cant create message' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          content: 'lorem ipsum lala'
        }

        expect(topic2.messages.size).to eql(3)

        post :create, room_id: room2.id, topic_id: topic2.id, message: params, format: :json

        expected_response = {
          error: 'Forbidden'
        }

        expect(user.rooms).to include(room1)
        expect(room2.participants).not_to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(topic2.reload.messages.size).to eql(3)
        expect(response.status).to eql(403)
      end
    end
  end
end
