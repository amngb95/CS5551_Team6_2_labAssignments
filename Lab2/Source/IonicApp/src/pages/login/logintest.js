describe("Validatelogin", function() {
  var scope;
  beforeEach(angular.mock.module("LoginPage"));
  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller('Validatelogin', {$scope: scope});
  }));
  it("check if username and password is empty", function() {

    scope.Valid('','');
    expect(scope.temp).toEqual("username and password can not be empty");
  });

  it("check if username is empty", function() {

    scope.Valid('','Anvesh');
    expect(scope.temp).toEqual("username can not be empty");
  });
  it("check if  password is empty", function() {

    scope.Valid('Anvesh','');
    expect(scope.temp).toEqual("password can not be empty");
  });

});
angular.module('LoginPage', []).controller('Validatelogin', function ($scope,$http) {
  $scope.temp = "";

  $scope.Valid = function (username,password) {

    $scope.username = username;
    $scope.password = password;

    if($scope.username == '' && $scope.password == '' )
    {

      $scope.temp = "username and password can not be empty";
    }

    else if($scope.username == '')
    {

      $scope.temp = "username can not be empty";
    }

    else
    {

      $scope.temp = "password can not be empty";
    }
  }
});
