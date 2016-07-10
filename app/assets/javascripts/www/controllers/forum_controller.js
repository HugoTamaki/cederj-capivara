app.controller('ForumCtrl', [
  '$scope',
  '$state',
  'Room',
  'User',
  'RoomService',
  'LabelService',
  'usSpinnerService',

  function ($scope,
            $state,
            Room,
            User,
            RoomService,
            LabelService,
            usSpinnerService) {

    $scope.user = User

    usSpinnerService.spin('my-rooms')
    usSpinnerService.spin('participating-rooms')
    usSpinnerService.spin('search-rooms')

    RoomService.getRooms()
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

    RoomService.getParticipatingRooms()
      .then(function (response) {
        $scope.participatingRooms = response.rooms.map(function (data) {
          return new Room(data)
        })
      })
      .catch(function () {
        $scope.error = LabelService.error.somethingWrong
      })
      .finally(function () {
        usSpinnerService.stop('participating-rooms')
      })

    RoomService.getSearch()
      .then(function (response) {
        $scope.searchedRooms = response.rooms.map(function (data) {
          return new Room(data)
        })
      })
      .catch(function () {
        $scope.error = LabelService.error.somethingWrong
      })
      .finally(function () {
        usSpinnerService.stop('search-rooms')
      })

    $scope.goToRoom = function (room) {
      $state.go('room', { room_id: room.id })
    }

    $scope.newRoom = function () {
      $state.go('new_room')
    }

    $scope.deleteRoom = function (room) {
      usSpinnerService.spin('my-rooms')

      RoomService.deleteRoom(room)
        .then(function (response) {
          return RoomService.getRooms()
        })
        .then(function (response) {
          $scope.notice = LabelService.notification.roomDelete.success
          $scope.rooms = response.rooms.map(function (data) {
            return new Room(data)
          })
        })
        .catch(function (response) {
          $scope.error = LabelService.error.somethingWrong
        })
        .finally(function () {
          usSpinnerService.stop('my-rooms')
        })
    }
  }
])
