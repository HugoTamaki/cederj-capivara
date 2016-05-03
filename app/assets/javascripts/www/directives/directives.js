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