app.controller('MenuCtrl', [
  '$scope',
  '$state',
  'CacheService',

  function ($scope,
            $state,
            CacheService) {


    $scope.signOut = function () {
      CacheService.remove('user')
      $state.go('login')
    }

    $scope.about = function () {
      $state.go('about')
    }
  }
])