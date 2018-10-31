var app = angular.module('RegisterApp', []);
app.controller('Signupcontroller',function ($scope,$http){
    $scope.CreateUser=function() {
        var Name="";var username="";var password="";var confirmpassword="";
        Name = $scope.txtName;
        username = $scope.txtUsername;
        password = $scope.txtPassword;
        confirmpassword = $scope.txtConfirmpassword;
        var Errormessage="";
        Errormessage= ValidateUserDetails(Name, username, password, confirmpassword);
        if(Errormessage!=null && Errormessage!=""){
            alert(Errormessage);

        }
        else{
            var array=[];
            array=getUserDetails();
            if(array.filter(user=>user.username==username).length>0)
            {
                alert('User already exists with the username. Please try signup with another username');
            }
            else
            {
                var details={
                    name:Name,
                    username:username,
                    password:password
                };
                array.push(details);
                localStorage.setItem("UserDetails",JSON.stringify(array));
                sessionStorage.FBName=Name;
                window.location.href = "HomePage.html";
            }
        }
    }
});
function ValidateUserDetails(Name,username,password,confirmpassword) {
    //Signup - storing user details in local storage
    //Created by : Hiresh
    //Created Date : 09-17-2018

    //Validation Starts
    var missingValues = "";
    if (Name == null || Name == "") {
        missingValues = missingValues + "Name,";
    }
    if (username == null || username == "") {
        missingValues = missingValues + "Username,";
    }
    if (password == null || password == "") {
        missingValues = missingValues + "Password,";
    }
    if (confirmpassword == null || confirmpassword == "") {
        missingValues = missingValues + "Confirm Password,";
    }
    if (missingValues != null && missingValues != "") {
        return "Please Enter :" + missingValues.substr(0,missingValues.length-1);
    }
    else
    {
        return "";
    }
}