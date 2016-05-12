app.controller('ProfileCtrl', [
  '$scope',
  '$state',
  'User',

  function ($scope,
            $state,
            User) {

    $scope.user = User
  }
])