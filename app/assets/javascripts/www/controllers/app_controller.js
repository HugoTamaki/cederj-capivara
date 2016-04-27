app.controller('AppCtrl', [
  '$scope',
  '$state',

  function ($scope,
            $state) {

    $scope.hello = 'Hello World!'

    $scope.about = function () {
      $state.go('about')
    }
  }
])