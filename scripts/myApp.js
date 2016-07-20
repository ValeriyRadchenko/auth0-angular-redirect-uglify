'use strict';
angular.module('myApp', [
  'ngCookies', 'auth0', 'ngRoute', 'angular-storage', 'angular-jwt'
])
.config(['$routeProvider','authProvider','$httpProvider','$locationProvider','jwtInterceptorProvider',
  function ($routeProvider, authProvider, $httpProvider, $locationProvider, jwtInterceptorProvider) {
  $routeProvider
  .when('/logout',  {
    templateUrl: 'views/logout.html',
    controller: 'LogoutCtrl'
  })
  .when('/login',   {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  })
  .when('/', {
    templateUrl: 'views/root.html',
    controller: 'RootCtrl',
    /* isAuthenticated will prevent user access to forbidden routes */
    requiresLogin: true
  });

  authProvider.init({
    domain: '<YOUR_DOMAIN>',
    clientID: '<YOUR_CLIENT_ID>',
    loginUrl: '/login'
  });

  authProvider.on('loginSuccess', ['$location','profilePromise','idToken','store',function($location, profilePromise, idToken, store) {
    console.log("Login Success");
    profilePromise.then(function(profile) {
      store.set('profile', profile);
      store.set('token', idToken);
    });
    $location.path('/');
  }]);

  authProvider.on('authenticated', ['$location', function($location) {
    console.log("Authenticated");
  }]);

  authProvider.on('logout', [function() {
    console.log("Logged out");
  }]);

  // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
  // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
  // want to check the delegation-token example

  jwtInterceptorProvider.tokenGetter = ['store', function(store) {
    return store.get('token');
  }];

  // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
  // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
  // want to check the delegation-token example
  $httpProvider.interceptors.push('jwtInterceptor');
}]).run(['$rootScope','auth','store','jwtHelper','$location',function($rootScope, auth, store, jwtHelper, $location) {
  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          $location.path('/login');
        }
      }
    }

  });
}]);