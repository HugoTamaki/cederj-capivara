'use strict';

describe('ForumCtrl', function() {
  var $controller, $state, $scope, $rootScope, $httpBackend, Room, User, usSpinnerService, RoomService,
      RoomEntryRequestService, RoomEntryRequest, LabelService, roomEntryRequests, rooms, participatingRooms;

  var roomsURL = 'http://localhost:3000/api/v1/rooms';
  var acceptURL = 'http://localhost:3000/api/v1/room_entry_requests/1/accept';
  var searchURL = 'http://localhost:3000/api/v1/rooms/search?term=term';
  var deleteRoomURL = 'http://localhost:3000/api/v1/rooms/1';
  var roomEntryRequestsURL = 'http://localhost:3000/api/v1/room_entry_requests';
  var participatingRoomsURL = 'http://localhost:3000/api/v1/rooms/participating_rooms';

  var roomEntryRequestsResponse = {
    room_entry_requests: [
      {
        id: 1,
        accepted: false,
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

  var roomsResponse = {
    rooms: [
      {
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
    ]
  }

  beforeEach(module('capivara'));

  beforeEach(inject(function(_$controller_, _$state_, _$rootScope_, _$httpBackend_, _Room_, _User_, _usSpinnerService_, _RoomService_,
                             _RoomEntryRequestService_, _RoomEntryRequest_, _LabelService_) {
    $state = _$state_;
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    Room = _Room_;
    User = _User_;
    usSpinnerService = _usSpinnerService_;
    RoomService = _RoomService_;
    RoomEntryRequestService = _RoomEntryRequestService_;
    RoomEntryRequest = _RoomEntryRequest_;
    LabelService = _LabelService_;
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET(/\.html$/).respond('');

    roomEntryRequests = [
      new RoomEntryRequest(roomEntryRequestsResponse.room_entry_requests[0])
    ];

    rooms = [
      new Room(roomsResponse.rooms[0])
    ]

    participatingRooms = [
      new Room(roomsResponse.rooms[0])
    ]
  }));


  function loadController() {
    $controller('ForumCtrl', { $scope: $scope });
  }

  beforeEach(function() {
    spyOn(usSpinnerService, 'spin');
    spyOn(usSpinnerService, 'stop');
    spyOn($state, 'go');
    $httpBackend.expect("GET", roomEntryRequestsURL).respond(200, roomEntryRequestsResponse);
    $httpBackend.expect("GET", roomsURL).respond(200, roomsResponse);
    $httpBackend.expect("GET", participatingRoomsURL).respond(200, roomsResponse);
    loadController();
    $httpBackend.flush();
  })

  describe('initializing controller', function() {
    it('defines scope user', function() {
      expect($scope.user).toBeDefined();
    });

    it('defines scope roomService', function() {
      expect($scope.roomService).toBeDefined();
    });

    it('spins my-rooms spinner', function() {
      expect(usSpinnerService.spin).toHaveBeenCalledWith('my-rooms')
    });

    it('spins participating-rooms spinner', function() {
      expect(usSpinnerService.spin).toHaveBeenCalledWith('participating-rooms')
    });

    it('spins entry-requests spinner', function() {
      expect(usSpinnerService.spin).toHaveBeenCalledWith('entry-requests')
    });

    it('gets roomEntryRequests', function() {
      expect($scope.roomEntryRequests.toString()).toEqual(roomEntryRequests.toString());
    });

    it('gets rooms', function() {
      expect($scope.rooms.toString()).toEqual(rooms.toString());
    });

    it('gets participatingRooms', function() {
      expect($scope.participatingRooms.toString()).toEqual(participatingRooms.toString());
    });
  });

  describe('#accept', function() {
    var request = roomEntryRequestsResponse.room_entry_requests[0];

    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect("PUT", acceptURL).respond(200, {});
        $httpBackend.expect("GET", roomEntryRequestsURL).respond(200, roomEntryRequestsResponse);
        $scope.accept(request);
        $httpBackend.flush();
      });

      it('spins request spinner', function() {
        expect(usSpinnerService.spin).toHaveBeenCalledWith('entry-requests');
      });

      it('sets notice on scope', function() {
        expect($scope.notice).toEqual('Pedido aceito com sucesso.');
      });

      it('stops request spinner', function() {
        expect(usSpinnerService.stop).toHaveBeenCalledWith('entry-requests');
      });
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect("PUT", acceptURL).respond(400, {});
        $scope.accept(request);
        $httpBackend.flush();
      });

      it('sets error on scope', function() {
        expect($scope.error).toEqual('Alguma coisa aconteceu, tente novamente mais tarde.');
      });
    });
  });

  describe('#goToRoom', function() {
    var room = roomsResponse.rooms[0];

    beforeEach(function() {
      $scope.goToRoom(room);
    });

    it('cleans RoomService.term', function() {
      expect(RoomService.term).toEqual('');
    });

    it('calls room state', function() {
      expect($state.go).toHaveBeenCalledWith('room', {room_id: room.id});
    });
  });

  describe('#newRoom', function() {
    beforeEach(function() {
      $scope.newRoom();
    });

    it('cleans RoomService.term', function() {
      expect(RoomService.term).toEqual('');
    });

    it('calls new_room state', function() {
      expect($state.go).toHaveBeenCalledWith('new_room');
    });
  });

  describe('#search', function() {
    describe('success', function() {
      beforeEach(function() {
        RoomService.term = 'term';
        $httpBackend.expect("GET", searchURL).respond(200, roomsResponse);
        $scope.search()
        $httpBackend.flush();
      });

      it('spins search-room spinner', function() {
        expect(usSpinnerService.spin).toHaveBeenCalled();
      });

      it('fills searchedRooms', function() {
        expect($scope.searchedRooms.toString()).toEqual(rooms.toString());
      });

      it('stops search-room spinner', function() {
        expect(usSpinnerService.stop).toHaveBeenCalled();
      });
    });

    describe('failure', function() {
      beforeEach(function() {
        RoomService.term = 'term';
        $httpBackend.expect("GET", searchURL).respond(400, {});
        $scope.search()
        $httpBackend.flush();
      });

      it('fills error message', function() {
        expect($scope.error).toEqual('Alguma coisa aconteceu, tente novamente mais tarde.');
      });
    });
  });

  describe('#deleteRoom', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect("DELETE", deleteRoomURL).respond(200, roomsResponse.rooms[0]);
        $httpBackend.expect("GET", roomsURL).respond(200, roomsResponse);
        $scope.deleteRoom({id: 1});
        $httpBackend.flush();
      });

      it('spins my-rooms spinner', function() {
        expect(usSpinnerService.spin).toHaveBeenCalledWith('my-rooms');
      });

      it('sets rooms to scope', function() {
        expect($scope.rooms.toString()).toEqual(rooms.toString());
      });

      it('sets notice', function() {
        expect($scope.notice).toEqual('Sala de discussão apagada com sucesso.');
      });

      it('stops my-rooms spinner', function() {
        expect(usSpinnerService.stop).toHaveBeenCalledWith('my-rooms');
      });
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect("DELETE", deleteRoomURL).respond(400, {});
        $scope.deleteRoom({id: 1});
        $httpBackend.flush();
      });

      it('fills error message', function() {
        expect($scope.error).toEqual('Alguma coisa aconteceu, tente novamente mais tarde.');
      });
    });
  });
});