'use strict';

describe('Room', function() {
  describe('RoomCtrl', function() {
    var $controller, $state, $stateParams, $scope, $rootScope, $httpBackend, usSpinnerService, Room, Topic, formattedRoom, formattedTopics;

    beforeEach(module('capivara'));

    var roomEntryRequestsURL = 'http://localhost:3000/api/v1/room_entry_requests/sent_requests?room_id=1';
    var roomURL = 'http://localhost:3000/api/v1/rooms/1';
    var roomTopicsURL = 'http://localhost:3000/api/v1/rooms/1/topics';

    var roomEntryRequestsResponse = {
      room_entry_requests: [
        {
          id: 1,
          accepted: true,
          sender: {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@email.com'
          },
          receiver: {
            id: 2,
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@email.com'
          },
          room: {
            id: 1,
            name: 'CPW',
            public: false,
            user: {
              id: 2,
              first_name: 'Jane',
              last_name: 'Doe',
              email: 'janedoe@email.com',
              room_ids: [1, 2]
            }
          }
        }
      ]
    }

    var roomResponse = {
      room: {
        id: 3,
        name: 'PDA',
        public: false,
        user: {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'johndoe@email.com'
        },
        created_at: Date.now(),
        updated_at: Date.now()
      }
    }

    var topicsResponse = {
      topics: [
        {
          id: 1,
          name: 'Some topic',
          content: 'Topic content',
          room: {
            id: 1,
            name: 'CPW'
          },
          user: {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@email.com'
          },
          created_at: Date.now(),
          updated_at: Date.now()
        }
      ]
    };


    beforeEach(inject(function(_$controller_, _$state_, _$stateParams_, _$rootScope_, _$httpBackend_, _usSpinnerService_, _Room_, _Topic_) {
      $state = _$state_;
      $stateParams = _$stateParams_;
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      usSpinnerService = _usSpinnerService_;
      Room = _Room_;
      Topic = _Topic_;
      $httpBackend.whenGET(/\.html$/).respond('');

      formattedRoom = new Room(roomResponse.room);
      formattedTopics = _.map(topicsResponse.topics, function(topic) {
        return new Topic(topic);
      });
    }));

    function loadController() {
      $controller('RoomCtrl', { $scope: $scope, $stateParams: {room_id: 1} });
    }

    describe('when initializing', function() {
      describe('success', function() {
        beforeEach(function() {
          spyOn(usSpinnerService, 'spin');
          spyOn(usSpinnerService, 'stop');
          $httpBackend.expect("GET", roomEntryRequestsURL).respond(200, roomEntryRequestsResponse);
          $httpBackend.expect("GET", roomURL).respond(200, roomResponse);
          $httpBackend.expect("GET", roomTopicsURL).respond(200, topicsResponse);
          loadController();
          $httpBackend.flush();
        });

        it('defines $scope.user', function() {
          expect($scope.user).toBeDefined();
        });

        it('spins loader', function() {
          expect(usSpinnerService.spin).toHaveBeenCalledWith('my-topics');
        });

        it('sets sentRoomEntryRequest', function() {
          expect($scope.sentRoomEntryRequest).toEqual(roomEntryRequestsResponse.room_entry_requests[0]);
        });

        it('sets room', function() {
          expect($scope.room.toString()).toEqual(formattedRoom.toString());
        });

        it('sets topics', function() {
          expect($scope.room.topics.toString()).toEqual(formattedTopics.toString());
        });

        it('it hides loading spin', function() {
          expect(usSpinnerService.stop).toHaveBeenCalled();
        });
      });

      describe('failure', function() {
        beforeEach(function() {
          spyOn(usSpinnerService, 'spin');
          $httpBackend.expect("GET", roomEntryRequestsURL).respond(400, {});
          loadController();
          $httpBackend.flush();
        });

        it('sets error message', function() {
          expect($scope.error).toEqual('Alguma coisa aconteceu, tente novamente mais tarde.');
        });
      });
    });
  });

  describe('NewRoomCtrl', function() {
    var $controller, $state, $stateParams, $scope, $rootScope, $httpBackend, usSpinnerService, User, room;

    beforeEach(module('capivara'));

    var roomURL = 'http://localhost:3000/api/v1/rooms';

    beforeEach(inject(function(_$controller_, _$state_, _$stateParams_, _$rootScope_, _$httpBackend_, _usSpinnerService_, _User_) {
      $state = _$state_;
      $stateParams = _$stateParams_;
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      usSpinnerService = _usSpinnerService_;
      User = _User_;

      $httpBackend.whenGET(/\.html$/).respond('');
    }));

    var roomResponse = {
      room: {
        id: 3,
        name: 'PDA',
        public: false,
        user: {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'johndoe@email.com'
        },
        created_at: Date.now(),
        updated_at: Date.now()
      }
    }

    room = roomResponse.room;

    function loadController() {
      $controller('NewRoomCtrl', { $scope: $scope });
    }

    describe('#createRoom', function() {
      describe('success', function() {
        beforeEach(function() {
          spyOn(usSpinnerService, 'spin');
          spyOn(usSpinnerService, 'stop');
          spyOn(User, 'updateRoomIds');
          loadController();
          $httpBackend.expect("POST", roomURL).respond(200, roomResponse);
          $scope.createRoom(room);
          $httpBackend.flush();
        });

        it('spins loader', function() {
          expect(usSpinnerService.spin).toHaveBeenCalledWith('create-room');
        });

        it('updates User roomIds', function() {
          expect(User.updateRoomIds).toHaveBeenCalled();
        });

        it('stops spinner', function() {
          expect(usSpinnerService.stop).toHaveBeenCalled();
        });
      });

      describe('failure', function() {
        beforeEach(function() {
          loadController();
          $httpBackend.expect("POST", roomURL).respond(400, roomResponse);
          $scope.createRoom(room);
          $httpBackend.flush();
        });

        it('sets error message', function() {
          expect($scope.error).toEqual('Alguma coisa aconteceu, tente novamente mais tarde.');
        });
      });
    });
  });
});