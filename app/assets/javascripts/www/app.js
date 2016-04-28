var app = angular.module('cederj-site', ['ui.router', 'templates'])

app.config([
  '$stateProvider',
  '$urlRouterProvider',

  function ($stateProvider,
            $urlRouterProvider) {

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'login.html',
        controller: 'LoginCtrl'
      })

      .state('about', {
        url: '/about',
        templateUrl: 'about.html'
      })
  }
])
