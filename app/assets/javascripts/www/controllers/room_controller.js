capivara.controller('RoomCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'User',
  'Room',
  'Topic',
  'RoomService',
  'RoomEntryRequestService',
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
            RoomEntryRequestService,
            TopicService,
            LabelService,
            usSpinnerService) {

    $scope.user = User

    usSpinnerService.spin('my-topics')

    RoomEntryRequestService.getSentRoomEntryRequests($stateParams)
      .then(function (response) {
        $scope.sentRoomEntryRequest = response.room_entry_requests[0]
        return RoomService.getRoom($stateParams)
      })
      .then(function (response) {
        $scope.room = new Room(response.room)
        if (roomIsAccepted() || $scope.room.belongsToUserParticipatingRooms()) {
          return RoomService.getRoomTopics($stateParams)
        } else {
          return {}.topics = []
        }
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

      var params = {
        room_id: topic.room.id,
        topic_id: topic.id
      }

      TopicService.deleteTopic(params)
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

    $scope.createRoomEntryRequest = function (room) {
      var options = {
        room_id: room.id,
        receiver_id: room.author.id
      }

      RoomService.createRoomEntryRequest(options)
        .then(function (response) {
          $scope.sentRoomEntryRequest = response.room_entry_request
          $scope.notice = LabelService.notification.roomEntryRequest.invitation.success
        })
        .catch(function () {
          $scope.error = LabelService.error.somethingWrong
        })
    }

    function roomIsAccepted () {
      return $scope.sentRoomEntryRequest && $scope.sentRoomEntryRequest.accepted
    }
  }
])

.controller('NewRoomCtrl', [
  '$scope',
  '$state',
  'User',
  'RoomService',
  'LabelService',
  'usSpinnerService',

  function ($scope,
            $state,
            User,
            RoomService,
            LabelService,
            usSpinnerService) {

    $scope.room = {}

    $scope.createRoom = function (room) {

      usSpinnerService.spin('create-room')

      RoomService.createRoom(room)
        .then(function (response) {
          User.updateRoomIds(response.room)
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