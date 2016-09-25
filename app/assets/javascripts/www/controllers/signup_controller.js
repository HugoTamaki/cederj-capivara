capivara.controller('SignUpCtrl', [
  '$scope',
  '$state',
  'User',
  'usSpinnerService',
  'LabelService',
  'CoursesService',

  function ($scope,
            $state,
            User,
            usSpinnerService,
            LabelService,
            CoursesService) {

    $scope.user = {}

    CoursesService.getCourses()
      .then(function (response) {
        $scope.courses = response.courses
      })

    $scope.signUp = function (user) {

      var options = {
        user: {
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          course_id: user.course_id,
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