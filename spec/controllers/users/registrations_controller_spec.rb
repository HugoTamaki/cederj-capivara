require 'rails_helper'

describe Users::RegistrationsController do
  let!(:computacao) { FactoryGirl.create(:course, name: 'Tecnologia em Sistemas de Computação') }
  let!(:pda)        { FactoryGirl.create(:discipline, name: 'PDA', description: 'discipline desc', course: computacao) }
  let!(:cpw)        { FactoryGirl.create(:discipline, name: 'CPW', description: 'discipline desc', course: computacao) }

  before(:each) do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  describe 'POST #create' do
    context 'valid' do
      it 'creates user and send user info and token' do
        post :create, {
          user: {
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@email.com',
            course_id: computacao.id,
            password: '123123123',
            password_confirmation: '123123123'
          }
        }

        user = User.last
        api_key = ApiKey.last
        user_disciplines = user.user_disciplines

        expected_response = {
          user: {
            id: user.id,
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

        expect(user.first_name).to eql('John')
        expect(user.last_name).to eql('Doe')
        expect(user.email).to eql('johndoe@email.com')
        expect(user.course).to eql(computacao)
        expect(user.api_keys.count).to eql(1)
        expect(response.body).to eql(expected_response.to_json)
      end
    end

    context 'not valid' do
      context 'email is already taken' do
        let!(:user) { FactoryGirl.create(:user, email: 'johndoe@email.com') }

        it 'does not create user as email is the same' do
          post :create, {
            user: {
              first_name: 'John',
              last_name: 'Doe',
              email: 'johndoe@email.com',
              course_id: computacao.id,
              password: '123123123',
              password_confirmation: '123123123'
            }
          }

          expected_response = {
            error: {
              email: ['has already been taken']
            }
          }

          expect(response.body).to eql(expected_response.to_json)
          expect(User.count).to eql(1)
        end
      end
    end

    context 'attributes are not present' do
      it 'sends cant be blank error' do
        post :create, {
          user: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: ''
          }
        }

        expected_response = {
          error: {
            email: ["can't be blank"],
            password: ["can't be blank"],
            first_name: ["can't be blank"],
            last_name: ["can't be blank"],
            course_id: ["can't be blank"]
          }
        }

        expect(response.body).to eql(expected_response.to_json)
        expect(User.count).to eql(0)
      end
    end
  end

  describe 'PUT #update' do
    context 'valid' do
      let!(:user) { FactoryGirl.create(:user, email: 'johndoe@email.com', first_name: 'John', last_name: 'Doe', password: '123123123', password_confirmation: '123123123', course: computacao) }
      let!(:api_key) { FactoryGirl.create(:api_key, user: user, expires_at: Time.now + 7.days) }

      before(:each) do
        user.set_disciplines
      end

      context 'with password' do
        it 'updates user with password and send user info and token' do
          request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

          antique_password = user.encrypted_password

          expect(user.first_name).to eql('John')
          expect(user.last_name).to eql('Doe')

          user_disciplines = user.user_disciplines

          put :update, {
            user: {
              first_name: 'Jonhson',
              last_name: 'Doan',
              current_password: '123123123',
              password: '321321321',
              password_confirmation: '321321321'
            }
          }

          expected_response = {
            user: {
              id: user.id,
              first_name: 'Jonhson',
              last_name: 'Doan',
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

          expect(response.body).to eql(expected_response.to_json)
          expect(user.reload.encrypted_password).not_to eql(antique_password)
          expect(user.reload.first_name).to eql('Jonhson')
          expect(user.reload.last_name).to eql('Doan')
        end
      end

      context 'without password' do
        it 'updates user without password and send user info and token' do
          request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

          expect(user.first_name).to eql('John')
          expect(user.last_name).to eql('Doe')

          user_disciplines = user.user_disciplines

          put :update, {
            user: {
              first_name: 'Jonhson',
              last_name: 'Doan'
            }
          }

          expected_response = {
            user: {
              id: user.id,
              first_name: 'Jonhson',
              last_name: 'Doan',
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

          expect(response.body).to eql(expected_response.to_json)
          expect(user.reload.first_name).to eql('Jonhson')
          expect(user.reload.last_name).to eql('Doan')
        end
      end

      context 'update disciplines statuses' do
        it 'updates successfuly disciplines statuses' do
          request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

          user_disciplines = user.user_disciplines

          expect(user_disciplines[0].status).to eql('incomplete')
          expect(user_disciplines[1].status).to eql('incomplete')

          put :update, {
            user: {
              user_disciplines_attributes: [
                {
                  id: user.user_disciplines.first.id,
                  status: 'doing'
                },
                {
                  id: user.user_disciplines.last.id,
                  status: 'doing'
                }
              ]
            }
          }

          expected_response = {
            user: {
              id: user.id,
              first_name: 'John',
              last_name: 'Doe',
              email: 'johndoe@email.com',
              disciplines: [
                {
                  id: pda.id,
                  ud_id: user_disciplines[0].id,
                  name: pda.name,
                  description: pda.description,
                  status: 'doing'
                },
                {
                  id: cpw.id,
                  ud_id: user_disciplines[1].id,
                  name: cpw.name,
                  description: cpw.description,
                  status: 'doing'
                }
              ]
            },
            api_key: api_key.token
          }

          expect(response.body).to eql(expected_response.to_json)
        end
      end
    end

    context 'not valid' do
      let!(:user) { FactoryGirl.create(:user, email: 'johndoe@email.com', first_name: 'John', last_name: 'Doe', password: '123123123', password_confirmation: '123123123') }
      let!(:api_key) { FactoryGirl.create(:api_key, user: user, expires_at: Time.now + 7.days) }

      context 'with empty attrs' do
        it 'doesnt update user and send cant be blank error' do
          request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

          expect(user.first_name).to eql('John')
          expect(user.last_name).to eql('Doe')

          put :update, {
            user: {
              first_name: '',
              last_name: ''
            }
          }

          expected_response = {
            error: {
              first_name: ["can't be blank"],
              last_name: ["can't be blank"]
            }
          }

          expect(response.body).to eql(expected_response.to_json)
          expect(user.reload.first_name).to eql('John')
          expect(user.reload.last_name).to eql('Doe')
        end
      end

      context 'with invalid current password' do
        it 'doesnt update user and send cant be blank error' do
          request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

          expect(user.first_name).to eql('John')
          expect(user.last_name).to eql('Doe')

          put :update, {
            user: {
              first_name: 'Johnson',
              last_name: 'Doan',
              current_password: '123212321',
              password: '321321321',
              password_confirmation: '321321321'
            }
          }

          expected_response = {
            error: {
              current_password: ["is invalid"]
            }
          }

          expect(response.body).to eql(expected_response.to_json)
          expect(user.reload.first_name).to eql('John')
          expect(user.reload.last_name).to eql('Doe')
        end
      end

      context 'with different password confirmation' do
        it 'doesnt update user and send cant be blank error' do
          request.env['HTTP_AUTHORIZATION'] = "Token token=#{api_key.token}"

          expect(user.first_name).to eql('John')
          expect(user.last_name).to eql('Doe')

          put :update, {
            user: {
              id: user.id,
              first_name: 'Johnson',
              last_name: 'Doan',
              current_password: '123123123',
              password: '222222222',
              password_confirmation: '321321321'
            }
          }

          expected_response = {
            error: {
              password_confirmation: ["doesn't match Password"]
            }
          }

          expect(response.body).to eql(expected_response.to_json)
          expect(user.reload.first_name).to eql('John')
          expect(user.reload.last_name).to eql('Doe')
        end
      end
    end
  end
end