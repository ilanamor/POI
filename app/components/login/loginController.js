'use strict';

//-------------------------------------------------------------------------------------------------------------------
app.service('setHeadersToken',[ '$http', function ($http) {

    let token = ""

    this.set = function (t) {
        token = t
        $http.defaults.headers.common[ 'x-access-token' ] = t
        console.log("setToken")
    }

}])


app.controller('loginController', ['$scope', 'UserService', '$location', '$window', '$http','localStorageService','$rootScope',
    function($scope, UserService, $location, $window,  $http, localStorageService, $rootScope) {
        
    let self = this;
    //let serverUrl = 'http://localhost:3000/'

        self.user = {UserName: '', Password: ''};
        self.restorePswd = false;
        self.answers = {UserName: '',Answer1:'', Answer2:''};

        self.login = function(valid) {
            if (valid) {
                UserService.login(self.user).then(function (success) {
                    var token = success.data.token;
                    if (token){
                        var userObject = {UserName: self.user.UserName, token: token }
                        localStorageService.set('user',userObject);
                        alert('You are logged in');
                        UserService.initUser();
                        $location.path('/');
                    }else{
                        alert('Login failed');
                    }

                }, function () {
                    alert('log-in has failed');
                })
            }
        };
        self.getQuestions = function () {
            if (self.user.UserName === ''){
                alert('Please enter user name');
            }
            else {
                self.restorePswd = true;
            }
        };
        self.restore = function () {
            self.answers.UserName = self.user.UserName;
            $http.post('auth/retrivePassword', self.answers)
                .then(function(res){
                        self.password = res.data;
                        alert('Your password is:'+self.password);
                        self.restorePswd = false;
                    },
                    function(){
                        alert('Could not restore your password');
                    }
                );
            
        }


    }]);
