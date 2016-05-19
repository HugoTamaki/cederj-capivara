app.controller('ProfileCtrl', [
  '$scope',
  '$state',
  'User',

  function ($scope,
            $state,
            User) {

    $scope.user = User
  }
])

.controller('ProfileEditCtrl', [
  '$scope',
  '$state',
  'User',
  'LabelService',
  'usSpinnerService',

  function ($scope,
            $state,
            User,
            LabelService,
            usSpinnerService) {

    $scope.user = User

    $scope.edit = function (user) {
      var options = {
        api_v1_user: {
          first_name: user.first_name,
          last_name: user.last_name
        }
      }

      if (user.current_password) {
        _(options).extend({
          current_password: user.current_password,
          password: user.password,
          password_confirmation: user.password_confirmation
        })
      }

      usSpinnerService.spin('edit_profile')

      User.edit(options)
        .then(function () {
          $scope.notice = LabelService.notification.profileEdit.success
        })
        .catch(function () {
          $scope.error = LabelService.error.somethingWrong
        })
        .finally(function () {
          usSpinnerService.stop('edit_profile')
        })
    }
  }
])