require 'rails_helper'

describe Api::V1::TopicsController do
  render_views

  let!(:computacao)  { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computacao') }
  let!(:user)        { FactoryGirl.create(:user, email: 'johndoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:api_key)     { FactoryGirl.create(:api_key, user: user, expires_at: Time.now + 7.days) }
  let!(:room1)       { FactoryGirl.create(:room, user: user, name: 'Room 1', public: false) }
  let!(:topic1)      { FactoryGirl.create(:topic, name:'Topic title 1', content: 'lorem ipsum lari lara', room: room1, user: user) }
  let!(:topic2)      { FactoryGirl.create(:topic, name:'Topic title 2', content: 'lorem ipsum lari lara', room: room1, user: user) }
  let!(:topic3)      { FactoryGirl.create(:topic, name:'Topic title 3', content: 'lorem ipsum lari lara', room: room1, user: user) }
  let!(:user2)       { FactoryGirl.create(:user, email: 'janedoe@email.com', password: '123123123', password_confirmation: '123123123', course: computacao) }
  let!(:room2)       { FactoryGirl.create(:room, user: user2, name: 'Room 2', public: false) }
  let!(:topic4)      { FactoryGirl.create(:topic, name:'Topic title 4', content: 'lorem ipsum lari lara', room: room2, user: user2) }
  let!(:topic5)      { FactoryGirl.create(:topic, name:'Topic title 5', content: 'lorem ipsum lari lara', room: room2, user: user2) }
  let!(:topic6)      { FactoryGirl.create(:topic, name:'Topic title 6', content: 'lorem ipsum lari lara', room: room2, user: user2) }

  describe 'GET #index' do
    describe 'requests topics that user is owner' do
      it 'sends all topics from room' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :index, room_id: room1.id, format: :json

        expected_response = {
          topics: [
            {
              id: topic1.id,
              name: topic1.name,
              content: topic1.content,
              room: {
                id: room1.id,
                name: room1.name
              },
              user: {
                id: topic1.user.id,
                first_name: topic1.user.first_name,
                last_name: topic1.user.last_name,
                email: topic1.user.email
              },
              created_at: topic1.created_at.to_time.as_json,
              updated_at: topic1.updated_at.to_time.as_json
            },
            {
              id: topic2.id,
              name: topic2.name,
              content: topic2.content,
              room: {
                id: room1.id,
                name: room1.name
              },
              user: {
                id: topic2.user.id,
                first_name: topic2.user.first_name,
                last_name: topic2.user.last_name,
                email: topic2.user.email
              },
              created_at: topic2.created_at.to_time.as_json,
              updated_at: topic2.updated_at.to_time.as_json
            },
            {
              id: topic3.id,
              name: topic3.name,
              content: topic3.content,
              room: {
                id: room1.id,
                name: room1.name
              },
              user: {
                id: topic3.user.id,
                first_name: topic3.user.first_name,
                last_name: topic3.user.last_name,
                email: topic3.user.email
              },
              created_at: topic3.created_at.to_time.as_json,
              updated_at: topic3.updated_at.to_time.as_json
            }
          ]
        }

        expect(user.rooms).to include(room1)
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end

    describe 'requests topics from a room that a user belongs to' do
      before :each do
        room2.participants << user
      end

      it 'sends all topics from room' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :index, room_id: room2.id, format: :json

        expected_response = {
          topics: [
            {
              id: topic4.id,
              name: topic4.name,
              content: topic4.content,
              room: {
                id: room2.id,
                name: room2.name
              },
              user: {
                id: topic4.user.id,
                first_name: topic4.user.first_name,
                last_name: topic4.user.last_name,
                email: topic4.user.email
              },
              created_at: topic4.created_at.to_time.as_json,
              updated_at: topic4.updated_at.to_time.as_json
            },
            {
              id: topic5.id,
              name: topic5.name,
              content: topic5.content,
              room: {
                id: room2.id,
                name: room2.name
              },
              user: {
                id: topic5.user.id,
                first_name: topic5.user.first_name,
                last_name: topic5.user.last_name,
                email: topic5.user.email
              },
              created_at: topic5.created_at.to_time.as_json,
              updated_at: topic5.updated_at.to_time.as_json
            },
            {
              id: topic6.id,
              name: topic6.name,
              content: topic6.content,
              room: {
                id: room2.id,
                name: room2.name
              },
              user: {
                id: topic6.user.id,
                first_name: topic6.user.first_name,
                last_name: topic6.user.last_name,
                email: topic6.user.email
              },
              created_at: topic6.created_at.to_time.as_json,
              updated_at: topic6.updated_at.to_time.as_json
            }
          ]
        }

        expect(room2.participants).to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end

    describe 'requests topics from a room which the user is not owner nor belongs' do
      it 'sends no topics at all' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        get :index, room_id: room2.id, format: :json

        expected_response = {
          topics: []
        }

        expect(room2.participants).to match([])
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end
  end

  describe 'POST #create' do
    describe 'topic for room owned by user' do
      it 'creates a valid topic' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          name: 'My topic',
          content: 'lorem ipsum lala'
        }

        expect(room1.topics.size).to eql(3)

        post :create, room_id: room1.id, topic: params, format: :json

        topic = Topic.last

        expected_response = {
          topic: {
            id: topic.id,
            name: topic.name,
            content: topic.content,
            room: {
              id: room1.id,
              name: room1.name
            },
            user: {
              id: topic.user.id,
              first_name: topic.user.first_name,
              last_name: topic.user.last_name,
              email: topic.user.email
            }
          }
        }

        expect(user.rooms).to include(room1)
        expect(room2.participants).not_to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(room1.reload.topics.size).to eql(4)
      end
    end

    describe 'topic for room user is participating' do
      before :each do
        room2.participants << user
      end

      it 'creates a valid topic' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          name: 'My topic',
          content: 'lorem ipsum lala'
        }

        expect(room2.topics.size).to eql(3)

        post :create, room_id: room2.id, topic: params, format: :json

        topic = Topic.last

        expected_response = {
          topic: {
            id: topic.id,
            name: topic.name,
            content: topic.content,
            room: {
              id: room2.id,
              name: room2.name
            },
            user: {
              id: topic.user.id,
              first_name: topic.user.first_name,
              last_name: topic.user.last_name,
              email: topic.user.email
            }
          }
        }

        expect(user.rooms).to include(room1)
        expect(room2.participants).to include(user)
        expect(room2.reload.topics.size).to eql(4)
        expect(room2.participants).to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(200)
      end
    end

    describe 'topic for room not owned or participating by user' do
      it 'cant create topic' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          name: 'My topic',
          content: 'lorem ipsum lala'
        }

        expect(room2.topics.size).to eql(3)

        post :create, room_id: room2.id, topic: params, format: :json

        topic = Topic.last

        expected_response = {
          error: 'Forbidden'
        }

        expect(user.rooms).not_to include(room2)
        expect(room2.participants).not_to include(user)
        expect(room2.reload.topics.size).to eql(3)
        expect(room2.participants).not_to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(response.status).to eql(403)
      end
    end
  end

  describe 'PUT #update' do
    describe 'topic for room owned by user' do
      it 'updates topic' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          name: 'My topic',
          content: 'lorem ipsum lala'
        }

        expect(topic3.name).to eql('Topic title 3')

        put :update, room_id: room1.id, id: topic3.id, topic: params, format: :json

        topic = Topic.find(topic3.id)

        expected_response = {
          topic: {
            id: topic3.id,
            name: 'My topic',
            content: 'lorem ipsum lala',
            room: {
              id: room1.id,
              name: room1.name
            },
            user: {
              id: topic3.user.id,
              first_name: topic3.user.first_name,
              last_name: topic3.user.last_name,
              email: topic3.user.email
            }
          }
        }

        expect(user.rooms).to include(room1)
        expect(room2.participants).not_to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(topic3.reload.name).to eql('My topic')
        expect(topic3.content).to eql('lorem ipsum lala')
        expect(response.status).to eql(200)
      end
    end

    describe 'topic for room user is participating' do
      before :each do
        room2.participants << user
      end

      it 'creates a valid topic' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          name: 'My topic',
          content: 'lorem ipsum lala'
        }

        expect(topic6.name).to eql('Topic title 6')

        put :update, room_id: room2.id, id: topic6.id, topic: params, format: :json

        topic = Topic.find(topic6.id)

        expected_response = {
          topic: {
            id: topic6.id,
            name: 'My topic',
            content: 'lorem ipsum lala',
            room: {
              id: room2.id,
              name: room2.name
            },
            user: {
              id: topic6.user.id,
              first_name: topic6.user.first_name,
              last_name: topic6.user.last_name,
              email: topic6.user.email
            }
          }
        }

        expect(user.rooms).to include(room1)
        expect(room2.participants).to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(topic6.reload.name).to eql('My topic')
        expect(topic6.content).to eql('lorem ipsum lala')
        expect(response.status).to eql(200)
      end
    end

    describe 'topic for room not owned or participating by user' do
      it 'cant update topic' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        params = {
          name: 'My topic',
          content: 'lorem ipsum lala'
        }

        expect(topic6.name).to eql('Topic title 6')

        put :update, room_id: room2.id, id: topic6.id, topic: params, format: :json

        topic = Topic.find(topic6.id)

        expected_response = {
          error: 'Forbidden'
        }

        expect(user.rooms).not_to include(room2)
        expect(room2.participants).not_to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(topic6.reload.name).to eql('Topic title 6')
        expect(topic6.content).to eql('lorem ipsum lari lara')
        expect(response.status).to eql(403)
      end
    end
  end

  describe 'DELETE #destroy' do
    describe 'topic for room owned by user' do
      it 'deletes topic' do
        request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

        expect(room1.topics.size).to eql(3)

        delete :destroy, room_id: room1.id, id: topic3.id, format: :json

        expected_response = {
          topic: {
            id: topic3.id,
            name: topic3.name,
            content: topic3.content,
            room: {
              id: room1.id,
              name: room1.name
            },
            user: {
              id: topic3.user.id,
              first_name: topic3.user.first_name,
              last_name: topic3.user.last_name,
              email: topic3.user.email
            }
          }
        }

        expect(user.rooms).to include(room1)
        expect(room2.participants).not_to include(user)
        expect(response.body).to eql(expected_response.to_json)
        expect(room1.reload.topics.size).to eql(2)
        expect(response.status).to eql(200)
      end
    end
  end

  describe 'topic for room user is participating' do
    before :each do
      room2.participants << user
    end

    it 'deletes topic' do
      request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

      expect(room2.topics.size).to eql(3)

      delete :destroy, room_id: room2.id, id: topic6.id, format: :json

      expected_response = {
        topic: {
          id: topic6.id,
          name: topic6.name,
          content: topic6.content,
          room: {
            id: room2.id,
            name: room2.name
          },
          user: {
            id: topic6.user.id,
            first_name: topic6.user.first_name,
            last_name: topic6.user.last_name,
            email: topic6.user.email
          }
        }
      }

      expect(user.rooms).to include(room1)
      expect(room2.participants).to include(user)
      expect(response.body).to eql(expected_response.to_json)
      expect(room2.reload.topics.size).to eql(2)
      expect(response.status).to eql(200)
    end
  end

  describe 'topic for room not owned or participating by user' do
    it 'cant delete topic' do
      request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

      expect(room2.topics.size).to eql(3)

      delete :destroy, room_id: room2.id, id: topic6.id, format: :json

      expected_response = {
        error: 'Forbidden'
      }

      expect(user.rooms).not_to include(room2)
      expect(room2.participants).not_to include(user)
      expect(response.body).to eql(expected_response.to_json)
      expect(room2.reload.topics.size).to eql(3)
      expect(response.status).to eql(403)
    end
  end
end
