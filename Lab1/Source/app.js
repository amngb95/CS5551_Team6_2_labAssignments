(function(){
    "use strict";
    angular.module('angularApp', ['ngRoute'])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/login', {
                    templateUrl: 'login.html',
                    controller: 'loginCtrl',
                    controllerAs: 'login'
                })
                .when('/home', {
                    templateUrl: 'home.html',
                    controller: 'homeCtrl',
                    controllerAs: 'home'
                })
                .when('/register', {
                    templateUrl: 'register.html',
                    controller: 'registerCtrl',
                    controllerAs: 'register'
                })
                .otherwise({
                    templateUrl: 'login.html',
                    controller: 'loginCtrl',
                    controllerAs: 'login'
                });
        })
        .controller('homeCtrl', function($scope, $http) {
            $scope.fname =  "welcome" +sessionStorage.getItem('Name');
                $scope.getinfo = function () {
                    var inputText = $scope.inputText;
                    console.log(inputText);
                        var query =
                            'https://kgsearch.googleapis.com/v1/entities:search?query='+inputText+
                            '&key=AIzaSyDQdbF2ujNthzcGHhfgq6LwYCFHPxg9Hck&limit=1&indent=True';
                        $http.get(query).then(function (response) {
                            console.log(response.data.itemListElement);
                            $scope.name=response.data.itemListElement[0].result.name;
                            $scope.description = "Description : "+response.data.itemListElement[0].result.description;
                            $scope.article = "Article : \n"+response.data.itemListElement[0].result.detailedDescription.articleBody;
                            $scope.wiki = "Wiki : \n"+response.data.itemListElement[0].result.detailedDescription.url;
                            $scope.image = "Image : \n"+response.data.itemListElement[0].result.image.url;

                        });
                    }

        })
        .controller('loginCtrl', function($scope,$location) {
            $scope.checkDetails = function (username,password){
                $scope.fname =  sessionStorage.getItem('Name');
                var userList = JSON.parse(localStorage.getItem('users'));
                console.log(userList);
                if(userList.length > 0){
                    var filter = userList.filter(user => user.userName == username);
                    console.log(filter);
                    if(filter.length > 0){
                        if(filter[0].pwd == password){
                            console.log('Login Successfull');
                            var firstName = filter[0].firstName;
                            sessionStorage.setItem('Name',firstName);
                            $location.path('/home');
                        }else{
                            alert('Invalid Password Please try again')
                        }
                    }else{
                        alert('Invalid Username')
                    }
                }else{
                    alert('No users found Please create new Account')
                }
            }
        })
        .controller('registerCtrl', function($scope,$location) {
            var array = [];
            $scope.saveDetails = function () {
                console.log("Registration Successful Please LogIn");
                var firstName = document.getElementById('FirstName').value;
                var lastName = document.getElementById('LastName').value;
                var userName = document.getElementById('UserName').value;
                var password = document.getElementById('pwd').value;
                array = $scope.getDetails();
                var filter = array.filter(user => user.userName == userName);
                if(filter.length > 0){
                    alert("Username already exist !");
                    return false;
                }
                var obj = {
                    firstName:firstName,
                    lastName:lastName,
                    userName:userName,
                    pwd:password
                };
                array.push(obj);
                localStorage.setItem('users',JSON.stringify(array));
                alert('Registration Successful Please Log In')
                $location.path('/login');
            }
            $scope.getDetails = function () {
                var userList = JSON.parse(localStorage.getItem('users'));
                return userList?userList:[];
            }
        });
})();