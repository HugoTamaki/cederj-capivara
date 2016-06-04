app.controller('LoginCtrl', [
  '$scope',
  '$state',
  'User',
  'usSpinnerService',
  'LabelService',

  function ($scope,
            $state,
            User,
            usSpinnerService,
            LabelService) {

    $scope.user = {}

    $scope.login = function (user) {
      var options = {
        user: {
          email: user.email,
          password: user.password
        }
      }

      usSpinnerService.spin('login')

      User.signIn(options)
        .then(function () {
          $state.go('profile')
        })
        .catch(function () {
          $scope.error = LabelService.error.failedLogin
        })
        .finally(function () {
          usSpinnerService.stop('login')
        })
    }

    $scope.goToSignUp = function () {
      $state.go('sign_up')
    }
  }
])