'use strict';

/**
 * @ngdoc overview
 * @name nodejsMysqlAngularjsFrontApp
 * @description
 * # nodejsMysqlAngularjsFrontApp
 *
 * Main module of the application.
 */
angular
  .module('nodejsMysqlAngularjsFrontApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
