app.controller('SignUpCtrl', [
  '$scope',
  '$state',
  'User',

  function ($scope,
            $state,
            User) {

    $scope.user = {}

    $scope.signUp = function (user) {

      var options = {
        api_v1_user: {
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          password: user.password,
          password_confirmation: user.passworConfirmation
        }
      }

      User.signUp(options)
        .then(function () {
          $state.go('profile')
        })
    }
  }
])