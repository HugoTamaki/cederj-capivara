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
              id: message1.id,
              content: message1.content,
              topic_id: message1.topic.id,
              user_id: user.id
            },
            {
              id: message2.id,
              content: message2.content,
              topic_id: message2.topic.id,
              user_id: user.id
            },
            {
              id: message3.id,
              content: message3.content,
              topic_id: message3.topic.id,
              user_id: user.id
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
              id: message4.id,
              content: message4.content,
              topic_id: message4.topic.id,
              user_id: user.id
            },
            {
              id: message5.id,
              content: message5.content,
              topic_id: message5.topic.id,
              user_id: user.id
            },
            {
              id: message6.id,
              content: message6.content,
              topic_id: message6.topic.id,
              user_id: user.id
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
end
