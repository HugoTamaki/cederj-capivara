app.controller('RoomCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'User',
  'Room',
  'Topic',
  'RoomService',
  'TopicService',
  'LabelService',
  'usSpinnerService',

  function ($scope,
            $state,
            $stateParams,
            User,
            Room,
            Topic,
            RoomService,
            TopicService,
            LabelService,
            usSpinnerService) {

    $scope.user = User

    usSpinnerService.spin('my-topics')

    RoomService.getRoom($stateParams)
      .then(function (response) {
        $scope.room = new Room(response.room)
        return RoomService.getRoomTopics($stateParams)
      })
      .then(function (response) {
        $scope.room.topics = _(response.topics).map(function (data) {
          return new Topic(data)
        })
      })
      .catch(function () {
        $scope.error = LabelService.error.somethingWrong
      })
      .finally(function () {
        usSpinnerService.stop('my-topics')
      })

    $scope.goToTopic = function (topic) {
      $state.go('topic', { room_id: $scope.room.id, topic_id: topic.id })
    }

    $scope.newTopic = function (room) {
      $state.go('new_topic', { room_id: room.id })
    }

    $scope.deleteTopic = function(topic) {
      usSpinnerService.spin('my-topics')

      TopicService.deleteTopic(topic)
        .then(function (response) {
          return RoomService.getRoom($stateParams)
        })
        .then(function (response) {
          $scope.room = new Room(response.room)
          return RoomService.getRoomTopics($stateParams)
        })
        .then(function (response) {
          $scope.notice = LabelService.notification.topicDelete.success
          $scope.room.topics = _(response.topics).map(function (data) {
            return new Topic(data)
          })
        })
        .catch(function () {
          $scope.error = LabelService.error.somethingWrong
        })
        .finally(function () {
          usSpinnerService.stop('my-topics')
        })
    }
  }
])

.controller('NewRoomCtrl', [
  '$scope',
  '$state',
  'RoomService',
  'LabelService',
  'usSpinnerService',

  function ($scope,
            $state,
            RoomService,
            LabelService,
            usSpinnerService) {

    $scope.room = {}

    $scope.createRoom = function (room) {

      usSpinnerService.spin('create-room')

      RoomService.createRoom(room)
        .then(function (response) {
          $state.go('room', { room_id: response.room.id })
        })
        .catch(function (response) {
          $scope.error = LabelService.error.somethingWrong
        })
        .finally(function () {
          usSpinnerService.stop('create-room')
        })
    }
  }
])