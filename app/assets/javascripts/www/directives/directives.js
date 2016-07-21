app.directive('menu', [

  function () {

    return {
      restrict: 'E',
      scope: {
        signOut: '&'
      },
      templateUrl: 'directives/menu.html'
    }
  }
])

.directive('notice', [
  function () {

    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/notice.html'
    }
  }
])

.directive('compareTo', [

  function () {

    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
          if (modelValue === scope.otherModelValue) {
            ngModel.$setValidity("passwordVerify", true);
          } else {
            ngModel.$setValidity("passwordVerify", false);
          }
          return modelValue == scope.otherModelValue
        }

        scope.$watch("otherModelValue", function() {
          ngModel.$validate()
        })
      }
    };
  }
])