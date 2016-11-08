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

  describe('#getRooms', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', roomsURL).respond(200, {rooms: responseRooms})
      });

      it('gets rooms', function() {
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

      it('defers error', function() {
        RoomService.getRooms()
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('#getParticipatingRooms', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', participatingRoomsURL).respond(200, {rooms: responseRooms})
      });

      it('gets participating rooms', function() {
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

      it('defers error', function() {
        RoomService.getParticipatingRooms()
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('#getSearch', function() {
    describe('success', function() {
      beforeEach(function() {
        RoomService.term = 'something'
        $httpBackend.expect('GET', getSearchURL).respond(200, {rooms: responseRooms})
      });

      it('gets searched rooms', function() {
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

      it('defers error', function() {
        RoomService.getSearch()
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('#getRoomTopics', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', topicsURL).respond(200, {topics: responseTopics})
      });

      it('gets room topics', function() {
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

      it('defers error', function() {
        RoomService.getRoomTopics({room_id: 1})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('#getRoom', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', roomURL).respond(200, {room: responseRooms[0]})
      });

      it('gets room', function() {
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

      it('defers error', function() {
        RoomService.getRoom({room_id: 1})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('#createRoom', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('POST', roomsURL).respond(200, {room: responseRooms[0]})
      });

      it('saves room', function() {
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

      it('defers error', function() {
        RoomService.createRoom({name: 'CPW'})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          });
      });
    });
  });

  describe('#deleteRoom', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('DELETE', roomURL).respond(200, {room: responseRooms[0]})
      });

      it('deletes room', function() {
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

      it('defers error', function() {
        RoomService.deleteRoom({id: 1})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          });
      });
    });
  });

  describe('#createRoomEntryRequest', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('POST', roomEntryRequestURL).respond(200, {room_entry_request: responseEntryRequest[0]})
      });

      it('creates room entry request', function() {
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

      it('defers error', function() {
        RoomService.createRoomEntryRequest({room_id: 1, receiver_id: 2})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          });
      });
    });
  });
});

describe('TopicService', function() {
  var $q, $rootScope, $httpBackend, TopicService

  beforeEach(module('capivara'))

  beforeEach(inject(function(_$q_, _$rootScope_, _$httpBackend_, _TopicService_) {
    $q = _$q_
    $rootScope = _$rootScope_
    TopicService = _TopicService_
    $httpBackend = _$httpBackend_
    $httpBackend.whenGET(/\.html$/).respond('')
    deferred = _$q_.defer();
  }));

  var topicURL = 'http://localhost:3000/api/v1/rooms/1/topics/1';
  var topicsURL = 'http://localhost:3000/api/v1/rooms/1/topics';

  var responseTopics = [
    {
      id: 1,
      name: 'My topic',
      content: 'lorem ipsum lala',
      room: {
        id: 1,
        name: 'My room'
      },
      user: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@email.com'
      }
    },
    {
      id: 2,
      name: 'My topic',
      content: 'lorem ipsum lala',
      room: {
        id: 2,
        name: 'My room'
      },
      user: {
        id: 2,
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'janedoe@email.com'
      }
    }
  ]

  describe('#getTopic', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', topicURL).respond(200, {topic: responseTopics[0]})
      });

      it('gets topic', function() {
        var topic

        TopicService.getTopic({room_id: 1, topic_id: 1})
          .then(function(response) {
            topic = response.topic
          })

        $httpBackend.flush()
        expect(topic).toEqual(responseTopics[0])
      });
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', topicURL).respond(400, {error: 'some error'})
      });

      it('defers error', function() {
        TopicService.getTopic({room_id: 1, topic_id: 1})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('#createTopic', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('POST', topicsURL).respond(200, {topic: responseTopics[0]})
      });

      it('creates topic', function() {
        var topic, params;

        params = {
          room_id: 1,
          name: responseTopics[0].name,
          content: responseTopics[0].content
        }

        TopicService.createTopic(params)
          .then(function(response) {
            topic = response.topic
          })

        $httpBackend.flush()
        expect(topic).toEqual(responseTopics[0])
      })
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', topicsURL).respond(400, {error: 'some error'})
      });

      it('defers error', function() {
        TopicService.createTopic({room_id: 1})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('#deleteTopic', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('DELETE', topicURL).respond(200, {topic: responseTopics[0]})
      });

      it('deletes topic', function() {
        var topic

        TopicService.deleteTopic({room_id: 1, topic_id: 1})
          .then(function(response) {
            topic = response.topic
          })

        $httpBackend.flush()
        expect(topic).toEqual(responseTopics[0])
      });
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('DELETE', topicURL).respond(400, {error: 'some error'})
      });

      it('defers error', function() {
        TopicService.deleteTopic({room_id: 1, topic_id: 1})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          });
      });
    });
  });
});

describe('MessageService', function() {
  var $q, $rootScope, $httpBackend, MessageService;

  beforeEach(module('capivara'))

  beforeEach(inject(function(_$q_, _$rootScope_, _$httpBackend_, _MessageService_) {
    $q = _$q_
    $rootScope = _$rootScope_
    MessageService = _MessageService_
    $httpBackend = _$httpBackend_
    $httpBackend.whenGET(/\.html$/).respond('')
    deferred = _$q_.defer();
  }));

  var messagesURL = 'http://localhost:3000/api/v1/rooms/1/topics/1/messages';

  var responseMessages = [
    {
      id: 6,
      content: "My content",
      topic_id: 1,
      created_at: "2016-06-29T21:58:31.449-03:00",
      updated_at: "2016-06-29T21:58:31.449-03:00",
      user: {
        id: 1,
        email: "hugotamaki@gmail.com",
        first_name:"Hugo",
        last_name: "Tamaki"
      }
    },
    {
      id: 7,
      content: "My content",
      topic_id: 2,
      created_at: "2016-06-29T21:58:31.449-03:00",
      updated_at: "2016-06-29T21:58:31.449-03:00",
      user: {
        id: 2,
        email: "hugotamaki@gmail.com",
        first_name:"Hugo",
        last_name: "Tamaki"
      }
    }
  ]

  describe('#getMessages', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', messagesURL).respond(200, {messages: responseMessages})
      });

      it('gets messages', function() {
        var messages

        MessageService.getMessages({room_id: 1, topic_id: 1})
          .then(function(response) {
            messages = response.messages
          })

        $httpBackend.flush()
        expect(messages).toEqual(responseMessages)
      });
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', messagesURL).respond(400, {error: 'some error'})
      });

      it('defers error', function() {
        MessageService.getMessages({room_id: 1, topic_id: 1})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('#createMessage', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('POST', messagesURL).respond(200, {message: responseMessages[0]})
      });

      it('creates message', function() {
        var message, params;

        params = {
          room_id: 1,
          topic_id: 1,
          content: responseMessages[0].content
        }

        MessageService.createMessage(params)
          .then(function(response) {
            message = response.message
          })

        $httpBackend.flush()
        expect(message).toEqual(responseMessages[0])
      })
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', messagesURL).respond(400, {error: 'some error'})
      });

      it('defers error', function() {
        MessageService.createMessage({room_id: 1})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });
});

describe('RoomEntryRequestService', function() {
  var $q, $rootScope, $httpBackend, RoomEntryRequestService;

  beforeEach(module('capivara'))

  beforeEach(inject(function(_$q_, _$rootScope_, _$httpBackend_, _RoomEntryRequestService_) {
    $q = _$q_
    $rootScope = _$rootScope_
    RoomEntryRequestService = _RoomEntryRequestService_
    $httpBackend = _$httpBackend_
    $httpBackend.whenGET(/\.html$/).respond('')
    deferred = _$q_.defer();
  }));

  var roomEntryRequestsURL = 'http://localhost:3000/api/v1/room_entry_requests';
  var sentRoomEntryRequestsURL = 'http://localhost:3000/api/v1/room_entry_requests/sent_requests?room_id=1';
  var acceptRoomEntryRequestURL = 'http://localhost:3000/api/v1/room_entry_requests/1/accept';

  var responseRoomEntryRequests = [
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
          room_ids: [1, 2, 3]
        }
      }
    }
  ]

  describe('#getRoomEntryRequests', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', roomEntryRequestsURL).respond(200, {room_entry_requests: responseRoomEntryRequests})
      });

      it('gets room entry requests', function() {
        var roomEntryRequests;

        RoomEntryRequestService.getRoomEntryRequests()
          .then(function(response) {
            roomEntryRequests = response.room_entry_requests
          })

        $httpBackend.flush()
        expect(roomEntryRequests).toEqual(responseRoomEntryRequests)
      })
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', roomEntryRequestsURL).respond(400, {error: 'some error'})
      });

      it('defers error', function() {
        RoomEntryRequestService.getRoomEntryRequests()
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('#getSentRoomEntryRequests', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', sentRoomEntryRequestsURL).respond(200, {room_entry_requests: responseRoomEntryRequests})
      });

      it('gets sent room entry requests', function() {
        var roomEntryRequests;

        RoomEntryRequestService.getSentRoomEntryRequests({room_id: 1})
          .then(function(response) {
            roomEntryRequests = response.room_entry_requests
          })

        $httpBackend.flush()
        expect(roomEntryRequests).toEqual(responseRoomEntryRequests)
      })
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', sentRoomEntryRequestsURL).respond(400, {error: 'some error'})
      });

      it('defers error', function() {
        RoomEntryRequestService.getSentRoomEntryRequests({room_id: 1})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });

  describe('#accept', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', acceptRoomEntryRequestURL).respond(200, {room_entry_request: responseRoomEntryRequests[0]})
      });

      it('gets sent room entry requests', function() {
        var roomEntryRequest;

        RoomEntryRequestService.accept({id: 1})
          .then(function(response) {
            roomEntryRequest = response.room_entry_request
          })

        $httpBackend.flush()
        expect(roomEntryRequest).toEqual(responseRoomEntryRequests[0])
      })
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expect('GET', acceptRoomEntryRequestURL).respond(400, {error: 'some error'})
      });

      it('defers error', function() {
        RoomEntryRequestService.accept({id: 1})
          .catch(function(response) {
            expect(response.error).toEqual('some error')
          })
      });
    });
  });
});