'use strict';

describe('Topic', function() {
  var $controller, $state, $stateParams, $scope, $rootScope, $httpBackend, usSpinnerService,
      formattedTopic, formattedMessages, Topic, Message;

  beforeEach(module('capivara'));

  var topic = {
    id: 1,
    name: 'Como fazer a AD?',
    content: 'Eu não seeeeeeeei!',
    room: {
      id: 1,
      name: 'Sala de CPW'
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

  var messages = [
    {
      id: 1,
      content: 'Hahahaha',
      topic_id: 1,
      user: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@email.com'
      },
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 2,
      content: 'Hohoho',
      topic_id: 1,
      user: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@email.com'
      },
      created_at: Date.now(),
      updated_at: Date.now()
    },
  ]

  var saveTopicURL = 'http://localhost:3000/api/v1/rooms/1/topics';
  var topicURL = 'http://localhost:3000/api/v1/rooms/1/topics/1';
  var messagesURL = 'http://localhost:3000/api/v1/rooms/1/topics/1/messages';

  beforeEach(inject(function(_$controller_, _$state_, _$stateParams_, _$rootScope_, _$httpBackend_, _usSpinnerService_, _Topic_, _Message_) {
    $state = _$state_;
    $stateParams = _$stateParams_;
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    usSpinnerService = _usSpinnerService_;
    Topic = _Topic_;
    Message = _Message_;
    $httpBackend.whenGET(/\.html$/).respond('');

    formattedTopic = new Topic(topic);
    formattedMessages = _.map(messages, function(message) {
      return new Message(message);
    });
    formattedTopic.messages = formattedMessages;
  }));

  describe('TopicCtrl', function() {
    function loadController() {
      $controller('TopicCtrl', { $scope: $scope, $stateParams: {room_id: 1, topic_id: 1} });
    }

    describe('when initializing', function() {
      describe('success', function() {
        beforeEach(function() {
          spyOn(usSpinnerService, 'spin');
          spyOn(usSpinnerService, 'stop');
          $httpBackend.expect("GET", topicURL).respond(200, {topic: topic});
          $httpBackend.expect("GET", messagesURL).respond(200, {messages: messages});
          loadController();
          $httpBackend.flush();
        });

        it('spins loader', function() {
          expect(usSpinnerService.spin).toHaveBeenCalledWith('my-messages');
        });

        it('gets topic with messages', function() {
          expect($scope.topic.toString()).toEqual(formattedTopic.toString());
        });

        it('stops loader', function() {
          expect(usSpinnerService.stop).toHaveBeenCalled();
        });
      });

      describe('failure', function() {
        beforeEach(function() {
          $httpBackend.expect("GET", topicURL).respond(400, {});
          loadController();
          $httpBackend.flush();
        });

        it('sets error message', function() {
          expect($scope.error).toEqual('Alguma coisa aconteceu, tente novamente mais tarde.');
        });
      });
    });

    describe('#createMessage', function() {
      beforeEach(function() {
        $httpBackend.expect("GET", topicURL).respond(200, {topic: topic});
        $httpBackend.expect("GET", messagesURL).respond(200, {messages: messages});
        loadController();
        $httpBackend.flush();
      });

      it('creates message', function() {
        $httpBackend.expect("POST", messagesURL).respond(200, {message: messages[0]});
        $httpBackend.expect("GET", topicURL).respond(200, {topic: topic});
        $httpBackend.expect("GET", messagesURL).respond(200, {messages: messages});
        $scope.createMessage(topic, messages[0]);
        $httpBackend.flush();

        expect($scope.message).toEqual({});
      });
    });

    describe('#goToVisitedUser', function() {
      beforeEach(function() {
        loadController();
      });

      it('sends user to user page', function() {
        spyOn($state, 'go');
        $scope.goToVisitedUser({id: 1});
        expect($state.go).toHaveBeenCalledWith('users', {id: 1});
      });
    });
  });

  describe('NewTopicCtrl', function() {
    function loadController() {
      $controller('NewTopicCtrl', { $scope: $scope, $stateParams: {room_id: 1} });
    }

    describe('#createTopic', function() {
      describe('success', function() {
        beforeEach(function() {
          spyOn(usSpinnerService, 'spin');
          spyOn(usSpinnerService, 'stop');
          spyOn($state, 'go');
          loadController();
          topic.room_id = 1;
          $httpBackend.expect("POST", saveTopicURL).respond(200, {topic: topic});
          $scope.createTopic(topic);
          $httpBackend.flush();
        });

        it('spins loader', function() {
          expect(usSpinnerService.spin).toHaveBeenCalledWith('create-topic');
        });

        it('sends user to topic state', function() {
          expect($state.go).toHaveBeenCalledWith('topic', {room_id: 1, topic_id: 1})
        });

        it('stops loader', function() {
          expect(usSpinnerService.stop).toHaveBeenCalled();
        });
      });

      describe('failure', function() {
        beforeEach(function() {
          loadController();
          topic.room_id = 1;
          $httpBackend.expect("POST", saveTopicURL).respond(400, {});
          $scope.createTopic(topic);
          $httpBackend.flush();
        });

        it('sets error message', function() {
          expect($scope.error).toEqual('Alguma coisa aconteceu, tente novamente mais tarde.');
        });
      });
    });
  });
});