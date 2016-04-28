app.controller('LoginCtrl', [
  '$scope',
  '$state',

  function ($scope,
            $state) {

    $scope.user = {}

    $scope.login = function (user) {
      console.log(user)
    }
  }
])