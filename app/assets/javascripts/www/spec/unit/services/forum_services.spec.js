var Conf = {
  baseUrl: 'http://localhost:3000/api/v1/'
}
describe('RoomService', function() {
  var $q, $rootScope, $httpBackend, RoomService

  beforeEach(module('capivara'))

  beforeEach(inject(function(_$q_, _$rootScope_, _$httpBackend_, _RoomService_) {
    $q = _$q_
    $rootScope = _$rootScope_
    RoomService = _RoomService_
    $httpBackend = _$httpBackend_
    $httpBackend.whenGET(/\.html$/).respond('')
    deferred = _$q_.defer();
  }));

  var roomsURL = 'http://localhost:3000/api/v1/rooms'
  var participatingRoomsURL = 'http://localhost:3000/api/v1/rooms/participating_rooms'
  var getSearchURL = 'http://localhost:3000/api/v1/rooms/search?term=something'
  var topicsURL = 'http://localhost:3000/api/v1/rooms/1/topics'
  var roomURL = 'http://localhost:3000/api/v1/rooms/1'
  var roomEntryRequestURL = 'http://localhost:3000/api/v1/room_entry_requests'

  var responseRooms = [
    {
      id: 1,
      name: 'Test room',
      public: false,
      user: {
        id: 1,
        email: 'jonhdoe@email.com',
        first_name: 'John',
        last_name: 'Doe'
      }
    }
  ]

  var responseTopics = [
    {
      id: 1,
      name: 'Some topic',
      content: 'Some content',
      room: {
        id: 1,
        name: 'CPW'
      },
      user: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@email.com'
      }
    }
  ]

  var responseEntryRequest = [
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
          room_ids: [1, 3, 4]
        }
      }
    }
  ]

  describe('getRooms', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', roomsURL).respond(200, {rooms: responseRooms})
      });

      it('should get rooms', function() {
        var rooms

        RoomService.getRooms()
          .then(function(response) {
            rooms = response.rooms
          })

        $httpBackend.flush()
        expect(rooms).toEqual(responseRooms)
      })
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', roomsURL).respond(400, {error: 'some error'})
      });

      it('should defer error', function() {
        RoomService.getRooms()
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('getParticipatingRooms', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', participatingRoomsURL).respond(200, {rooms: responseRooms})
      });

      it('should get participating rooms', function() {
        var rooms

        RoomService.getParticipatingRooms()
          .then(function(response) {
            rooms = response.rooms
          })

        $httpBackend.flush()
        expect(rooms).toEqual(responseRooms)
      })
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', participatingRoomsURL).respond(400, {error: 'some error'})
      });

      it('should defer error', function() {
        RoomService.getParticipatingRooms()
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('getSearch', function() {
    describe('success', function() {
      beforeEach(function() {
        RoomService.term = 'something'
        $httpBackend.expect('GET', getSearchURL).respond(200, {rooms: responseRooms})
      });

      it('should get searched rooms', function() {
        var rooms

        RoomService.getSearch()
          .then(function(response) {
            rooms = response.rooms
          })

        $httpBackend.flush()
        expect(rooms).toEqual(responseRooms)
      })
    });

    describe('failure', function() {
      beforeEach(function() {
        RoomService.term = 'something'
        $httpBackend.expect('GET', getSearchURL).respond(400, {error: 'some error'})
      });

      it('should defer error', function() {
        RoomService.getSearch()
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('getRoomTopics', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', topicsURL).respond(200, {topics: responseTopics})
      });

      it('should get room topics', function() {
        var topics

        RoomService.getRoomTopics({room_id: 1})
          .then(function(response) {
            topics = response.topics
          })

        $httpBackend.flush()
        expect(topics).toEqual(responseTopics)
      })
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', topicsURL).respond(400, {error: 'some error'})
      });

      it('should defer error', function() {
        RoomService.getRoomTopics({room_id: 1})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('getRoom', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', roomURL).respond(200, {room: responseRooms[0]})
      });

      it('should get room', function() {
        var topics

        RoomService.getRoom({room_id: 1})
          .then(function(response) {
            topics = response.room
          })

        $httpBackend.flush()
        expect(topics).toEqual(responseRooms[0])
      })
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', roomURL).respond(400, {error: 'some error'})
      });

      it('should defer error', function() {
        RoomService.getRoom({room_id: 1})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('createRoom', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('POST', roomsURL).respond(200, {room: responseRooms[0]})
      });

      it('should save room', function() {
        var room

        RoomService.createRoom({name: 'CPW'})
          .then(function(response) {
            room = response.room
          })

        $httpBackend.flush()
        expect(room).toEqual(responseRooms[0])
      });
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('POST', roomsURL).respond(400, {error: 'some error'})
      });

      it('should defer error', function() {
        RoomService.createRoom({name: 'CPW'})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          });
      });
    });
  });

  describe('deleteRoom', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('DELETE', roomURL).respond(200, {room: responseRooms[0]})
      });

      it('should delete room', function() {
        var room

        RoomService.deleteRoom({id: 1})
          .then(function(response) {
            room = response.room
          })

        $httpBackend.flush()
        expect(room).toEqual(responseRooms[0])
      });
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('DELETE', roomURL).respond(400, {error: 'some error'})
      });

      it('should defer error', function() {
        RoomService.deleteRoom({id: 1})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          });
      });
    });
  });

  describe('createRoomEntryRequest', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('POST', roomEntryRequestURL).respond(200, {room_entry_request: responseEntryRequest[0]})
      });

      it('should create room entry request', function() {
        var request

        RoomService.createRoomEntryRequest({room_id: 1, receiver_id: 2})
          .then(function(response) {
            request = response.room_entry_request
          })

        $httpBackend.flush()
        expect(request).toEqual(responseEntryRequest[0])
      });
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('POST', roomEntryRequestURL).respond(400, {error: 'some error'})
      });

      it('should defer error', function() {
        RoomService.createRoomEntryRequest({room_id: 1, receiver_id: 2})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          });
      });
    });
  });
});