app.controller('AppCtrl', [
  '$scope',
  '$state',

  function ($scope,
            $state) {

    $state.go('login')
  }
])