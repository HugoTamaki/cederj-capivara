app.controller('LoginCtrl', [
  '$scope',
  '$state',
  'User',

  function ($scope,
            $state,
            User) {

    $scope.user = {}

    $scope.login = function (user) {
      var options = {
        api_v1_user: {
          email: user.email,
          password: user.password
        }
      }
      User.signIn(options)
        .then(function () {
          $state.go('profile')
        })
    }
  }
])