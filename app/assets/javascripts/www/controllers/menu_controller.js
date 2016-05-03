app.controller('MenuCtrl', [
  '$scope',
  '$state',
  'User',
  'CacheService',

  function ($scope,
            $state,
            User,
            CacheService) {


    $scope.signOut = function () {
      User.signOut()
        .then(function () {
          $state.go('login')
        })
    }

    $scope.about = function () {
      $state.go('about')
    }
  }
])