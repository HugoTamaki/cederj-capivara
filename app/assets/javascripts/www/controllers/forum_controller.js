app.controller('ForumCtrl', [
  '$scope',
  '$state',
  'User',
  'LabelService',
  'usSpinnerService',

  function ($scope,
            $state,
            User,
            LabelService,
            usSpinnerService) {

    $scope.user = User

    usSpinnerService.spin('rooms')

    User.getMyRooms()
      .then(function (response) {
        $scope.rooms = response.rooms
      })
      .catch(function () {
        $scope.error = LabelService.error.somethingWrong
      })
      .finally(function () {
        usSpinnerService.stop('rooms')
      })
  }
])