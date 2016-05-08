app.controller('SignUpCtrl', [
  '$scope',
  '$state',
  'User',
  'LabelService',

  function ($scope,
            $state,
            User,
            LabelService) {

    $scope.user = {}

    $scope.signUp = function (user) {

      var options = {
        api_v1_user: {
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          password: user.password,
          password_confirmation: user.passwordConfirmation
        }
      }

      User.signUp(options)
        .then(function () {
          $state.go('profile')
        })
        .catch(function () {
          $scope.error = LabelService.error.somethingWrong
        })
    }
  }
])