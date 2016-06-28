app.controller('RoomCtrl', [
  '$scope',
  '$stateParams',
  'User',
  'Room',
  'Topic',
  'ForumService',
  'LabelService',
  'usSpinnerService',

  function ($scope,
            $stateParams,
            User,
            Room,
            Topic,
            ForumService,
            LabelService,
            usSpinnerService) {

    $scope.user = User

    usSpinnerService.spin('my-topics')

    ForumService.getRoom($stateParams)
      .then(function (response) {
        $scope.room = new Room(response.room)
        return ForumService.getRoomTopics($stateParams)
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
      $state.go('topic', { id: topic.id })
    }
  }
])

.controller('NewRoomCtrl', [
  '$scope',
  '$state',
  'ForumService',
  'LabelService',
  'usSpinnerService',

  function ($scope,
            $state,
            ForumService,
            LabelService,
            usSpinnerService) {

    $scope.room = {}

    $scope.createRoom = function (room) {

      usSpinnerService.spin('create-room')

      ForumService.createRoom(room)
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