
window.fbAsyncInit = function() {
    FB.init({
        appId      : '445473702642088',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.8',
        status     : true
    });

   /* FB.getLoginStatus(function(response){
        if(response.status=='connected')
        {
        }else if(response.status='not_authorized')
        {

        }else{

        }
    })*/
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/**
 * Created by user on 23/10/2016.
 */
var myapp = angular.module('demoMongo',[]);
myapp.run(function ($http) {
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers.post['dataType'] = 'json'
});
myapp.controller('MongoRestController',function($scope,$http,$window){
        $scope.insertData = function(){
            console.log($scope.txtName);
            var dataParams = {
                'name' : $scope.txtName,
                'uaername' : $scope.txtUsername,
                'password' : $scope.txtPassword,
                'confirmpassword' : $scope.txtConfirmpassword
            };
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var req = $http.post('/enroll',dataParams)
                .then(function(data, status, headers, config) {
                    // $scope.message = data;
                    console.log("here "+data);
                    $window.location.href = 'index.html';
                    alert('Registartion Successful Please Login');
                });
        };

    }
);
