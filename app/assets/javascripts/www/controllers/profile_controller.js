app.controller('ProfileCtrl', [
  '$scope',
  '$state',
  'User',

  function ($scope,
            $state,
            User) {

    $scope.user = User

    $scope.setStatus = function (status) {
      if (status === 'incomplete') {
        return 'a fazer'
      } else if (status === 'doing') {
        return 'fazendo'
      } else {
        return 'completo'
      }
    }
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

    var formatDisciplines

    $scope.user = User
    $scope.disciplines = User.disciplines

    $scope.edit = function (user) {
      var options,
          disciplines = formatDisciplines(user.disciplines)

      var options = {
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          user_disciplines_attributes: disciplines
        }
      }

      if (user.current_password) {
        _(options.user).extend({
          current_password: user.current_password,
          password: user.password,
          password_confirmation: user.password_confirmation
        })
      }

      usSpinnerService.spin('edit_profile')

      User.edit(options)
        .then(function () {
          $scope.error = null
          $scope.notice = LabelService.notification.profileEdit.success
          delete $scope.user.current_password
          delete $scope.user.password
          delete $scope.user.password_confirmation
        })
        .catch(function () {
          $scope.notice = null
          $scope.error = LabelService.error.somethingWrong
        })
        .finally(function () {
          usSpinnerService.stop('edit_profile')
        })
    }

    formatDisciplines = function (disciplines) {
      return _(disciplines).map(function (discipline) {
        return {
          id: discipline.ud_id,
          status: discipline.status
        }
      })
    }
  }
])