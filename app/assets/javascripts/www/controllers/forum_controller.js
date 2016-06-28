app.controller('ForumCtrl', [
  '$scope',
  '$state',
  'Room',
  'User',
  'ForumService',
  'LabelService',
  'usSpinnerService',

  function ($scope,
            $state,
            Room,
            User,
            ForumService,
            LabelService,
            usSpinnerService) {

    $scope.user = User

    usSpinnerService.spin('my-rooms')
    usSpinnerService.spin('participating-rooms-rooms')

    ForumService.getRooms()
      .then(function (response) {
        $scope.rooms = response.rooms.map(function (data) {
          return new Room(data)
        })
      })
      .catch(function () {
        $scope.error = LabelService.error.somethingWrong
      })
      .finally(function () {
        usSpinnerService.stop('my-rooms')
      })

    ForumService.getParticipatingRooms()
      .then(function (response) {
        $scope.participatingRooms = response.rooms.map(function (data) {
          return new Room(data)
        })
      })
      .catch(function () {
        $scope.error = LabelService.error.somethingWrong
      })
      .finally(function () {
        usSpinnerService.stop('participating_rooms')
      })

    $scope.goToRoom = function (room) {
      $state.go('room', { room_id: room.id })
    }

    $scope.newRoom = function () {
      $state.go('new_room')
    }
  }
])
