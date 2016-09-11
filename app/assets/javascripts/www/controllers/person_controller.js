app.controller('PersonCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'usSpinnerService',
  'User',
  'PersonService',

  function ($scope,
            $state,
            $stateParams,
            usSpinnerService, 
            User,
            PersonService) {

    $scope.user = User

    // usSpinnerService.spin('user')

    PersonService.getPerson($stateParams)
      .then(function (response) {
        $scope.person = response.user
      })
  }
])