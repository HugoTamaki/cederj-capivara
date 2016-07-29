app.controller('ForumCtrl', [
  '$scope',
  '$state',
  'Room',
  'User',
  'RoomService',
  'RoomEntryRequestService',
  'RoomEntryRequest',
  'LabelService',
  'usSpinnerService',

  function ($scope,
            $state,
            Room,
            User,
            RoomService,
            RoomEntryRequestService,
            RoomEntryRequest,
            LabelService,
            usSpinnerService) {

    $scope.user = User

    $scope.roomService = RoomService

    usSpinnerService.spin('my-rooms')
    usSpinnerService.spin('participating-rooms')
    usSpinnerService.spin('search-rooms')
    usSpinnerService.spin('entry-requests')

    RoomEntryRequestService.getRoomEntryRequests()
      .then(function (response) {
        usSpinnerService.stop('entry-requests')
        $scope.roomEntryRequests = _(response.room_entry_requests).map(function (data) {
          return new RoomEntryRequest(data)
        })
      })

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

    $scope.accept = function (request) {
      usSpinnerService.spin('entry-requests')

      RoomEntryRequestService.accept(request)
        .then(function () {
          $scope.notice = LabelService.notification.accepted.success
          return RoomEntryRequestService.getRoomEntryRequests()
        })
        .then(function (response) {
          usSpinnerService.stop('entry-requests')
          $scope.roomEntryRequests = _(response.room_entry_requests).map(function (data) {
            return new RoomEntryRequest(data)
          })
        })
        .catch(function () {
          $scope.error = LabelService.error.somethingWrong
        })
        .finally(function () {
          usSpinnerService.stop('entry-requests')
        })
    }

    $scope.goToRoom = function (room) {
      $scope.roomService.term = ''
      $state.go('room', { room_id: room.id })
    }

    $scope.newRoom = function () {
      $scope.roomService.term = ''
      $state.go('new_room')
    }

    $scope.search = function () {
      usSpinnerService.spin('search-rooms')

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
