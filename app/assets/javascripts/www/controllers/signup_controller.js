app.controller('SignUpCtrl', [
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

      usSpinnerService.spin('sign_up')

      User.signUp(options)
        .then(function () {
          $state.go('profile')
        })
        .catch(function (error) {
          if (error.email && error.email[0] === 'has already been taken') {
            $scope.error = LabelService.error.alreadyTaken
          } else {
            $scope.error = LabelService.error.somethingWrong
          }
        })
        .finally(function () {
          usSpinnerService.stop('sign_up')
        })
    }

    $scope.goToLogin = function () {
      $state.go('login')
    }
  }
])