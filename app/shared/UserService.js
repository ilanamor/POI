/**
 * Created by Maayan on 8/3/2017.
 */
//-------------------------------------------------------------------------------------------------------------------
app.factory('UserService', ['$http', 'localStorageService', '$filter', '$rootScope', '$location',
    function($http, localStorageService, $filter, $rootScope, $location) {
        let service = {};

        service.initUser = function(){
            $rootScope.guest = true;
            $rootScope.UserName = '';
            $rootScope.LastLogin = '';
            if(localStorageService.cookie.isSupported){
                let user = localStorageService.cookie.get('user');
                if(user){
                    $rootScope.UserName = user.UserName; // extract cookie data
                    $rootScope.LastLogin = user.Date;

                    $http.defaults.headers.common = {                  //use the token for the user requets
                        'my-Token': user.Token,
                        'user' : user.UserName
                    };

                    $rootScope.guest=false;                 //update that this is not a guest

                    //update the cookie for the new login time!
                    var cookieObject = {UserName: user.UserName, Date: new Date(), Token: user.Token }
                    localStorageService.cookie.set('user',cookieObject);
                }
            }
        };

        service.getUserProducts = function(){
            if(!$rootScope.top5) {
                $http.get('/cakes/top5')
                    .then(function (res) {
                        $rootScope.top5 = res.data;
                    }).catch(function (e) {
                    return Promise.reject(e);
                });
            }
            if(!$rootScope.newProducts){
                $http.get('/cakes/logged/getNewCakes')
                    .then(function (res) {
                        $rootScope.newProducts = res.data;
                    })
                    .catch(function (e) {
                        return Promise.reject(e);
                    });
            }
        };

        service.getRecommendedProducts = function(){
            if(!$rootScope.guest && !$rootScope.recommendedCakes){
                $http.get('/users/recommandation/' + $rootScope.UserName)
                    .then(function (res) {
                        $rootScope.recommendedCakes = res.data;
                    })
                    .catch(function (e) {
                        return Promise.reject(e);
                    });
            }
        };

        service.login = function(user) {
            return $http.post('/users/login', user)
                .then(function(response) {
                    let token = response.data.token;
                    $http.defaults.headers.common = {
                        'my-Token': token,
                        'user' : user.UserName
                    };
                    return Promise.resolve(response);
                })
                .catch(function (e) {
                    return Promise.reject(e);
                });
        };

        service.logout = function () {
            localStorageService.cookie.remove('user');
            $location.path("/");
        };
        return service;
    }]);
