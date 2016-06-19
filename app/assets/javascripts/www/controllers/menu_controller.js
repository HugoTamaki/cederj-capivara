app.controller('MenuCtrl', [
  '$scope',
  '$state',
  'User',
  'CacheService',

  function ($scope,
            $state,
            User,
            CacheService) {

    $scope.user = User

    $scope.signOut = function () {
      User.signOut()
        .then(function () {
          $state.go('login')
        })
    }

    $scope.loginPage = function () {
      $state.go('login')
    }

    $scope.about = function () {
      $state.go('about')
    }

    $scope.profile = function () {
      $state.go('profile')
    }

    $scope.forum = function () {
      $state.go('forum')
    }

    $scope.editProfile = function () {
      $state.go('edit_profile')
    }
  }
])