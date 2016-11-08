capivara.controller('VisitedUserCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'usSpinnerService',
  'User',
  'UsersService',

  function ($scope,
            $state,
            $stateParams,
            usSpinnerService,
            User,
            UsersService) {

    $scope.user = User

    // usSpinnerService.spin('user')

    UsersService.getVisitedUser($stateParams)
      .then(function (response) {
        $scope.visitedUser = response.user
      })
  }
])