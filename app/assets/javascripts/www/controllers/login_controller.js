app.controller('LoginCtrl', [
  '$scope',
  '$state',
  'User',
  'LabelService',

  function ($scope,
            $state,
            User,
            LabelService) {

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
        .catch(function () {
          $scope.error = LabelService.error.failedLogin
        })
    }

    $scope.goToSignUp = function () {
      $state.go('sign_up')
    }
  }
])