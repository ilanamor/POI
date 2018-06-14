
'use strict';
//-------------------------------------------------------------------------------------------------------------------
app.controller('loginController', ['$scope', 'UserService', '$location', '$window', '$http','localStorageService','$rootScope',
    function($scope, UserService, $location, $window,  $http, localStorageService, $rootScope) {
        let self = this;

        self.user = {UserName: '', Password: ''};
        self.restorePswd = false;
        self.answers = {UserName: '',Answer1:'', Answer2:''};

        self.login = function(valid) {
            if (valid) {
                UserService.login(self.user).then(function (success) {
                    var token = success.data.token;
                    if (token){
                        var cookieObject = {UserName: self.user.UserName, Date: new Date(), Token: token }
                        localStorageService.cookie.set('user',cookieObject);
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
                $http.get('/users/questions/' +self.user.UserName)
                    .then(function (res) {
                        self.questions = res.data;
                    })
                    .catch(function (e) {
                        return Promise.reject(e);
                    });
            }
        };
        self.restore = function () {
            self.answers.UserName = self.user.UserName;
            $http.put('/users/restorePassword', self.answers)
                .then(function(res){
                        self.password = res.data;
                        alert('Your password is:'+self.password.Password);
                        self.restorePswd = false;
                    },
                    function(){
                        alert('Could not restore your password');
                    }
                );
            
        }


    }]);
