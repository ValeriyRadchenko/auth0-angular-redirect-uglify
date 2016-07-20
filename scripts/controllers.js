var myApp = angular.module('myApp');

myApp.controller('MenuCtrl', ['$scope','$location',function ($scope, $location) {
  $scope.go = function (target) {
    $location.path(target);
  };
}]);

myApp.controller('MsgCtrl', ['$scope','auth',function ($scope, auth) {
  $scope.message = {text: ''};
}]);

myApp.controller('RootCtrl', ['auth','$scope',function (auth, $scope) {
  $scope.auth = auth;
  $scope.$watch('auth.profile.name', function(name) {
    if (!name) {
      return;
    }
    $scope.message.text = 'Welcome ' + auth.profile.name + '!';
  });

}]);

myApp.controller('LoginCtrl', ['auth','$scope','$location','store',function (auth, $scope, $location, store) {
  $scope.user = '';
  $scope.pass = '';

  $scope.doGoogleAuthWithPopup = function () {
    $scope.message.text = 'loading...';
    $scope.loading = true;

    auth.signin({
      connection: 'google-oauth2',
      scope: 'openid name email'
    });
  };

}]);

myApp.controller('LogoutCtrl', ['auth','$scope','$location','store',function (auth, $scope, $location, store) {
  auth.signout();
  $scope.$parent.message = '';
  store.remove('profile');
  store.remove('token');
  $location.path('/login');
}]);
