var app = angular.module('cederj-site', ['ui.router', 'templates'])

app.config([
  '$stateProvider',
  '$urlRouterProvider',

  function ($stateProvider,
            $urlRouterProvider) {

    $stateProvider
      .state('about', {
        url: '/about',
        templateUrl: 'about.html'
      })
  }
])
