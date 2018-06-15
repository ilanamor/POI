/**
 * Created by Maayan on 8/3/2017.
 */
//-------------------------------------------------------------------------------------------------------------------
app.factory('UserService', ['$http', 'localStorageService', '$filter', '$rootScope', '$location',
    function ($http, localStorageService, $filter, $rootScope, $location) {
        let service = {};

        service.initUser = function () {
            $rootScope.guest = true;
            $rootScope.UserName = '';
            //$rootScope.LastLogin = '';
            if (localStorageService.isSupported) {
                let user = localStorageService.get('user');
                if (user) {
                    $rootScope.UserName = user.UserName; // extract cookie data
                    //$rootScope.LastLogin = user.Date;

                    $http.defaults.headers.common = {                  //use the token for the user requets
                        'token': user.token,
                        'user': user.UserName
                    };

                    $rootScope.guest = false;                 //update that this is not a guest

                    //update the userObject
                    var userObject = { UserName: user.UserName, token: user.token }
                    localStorageService.set('user', userObject);
                }
            }
        };


        service.getRandomPoints = function () {
            if (!$rootScope.top3) {
                $http.get('point/RandomPoints/3')
                    .then(function (res) {
                        $rootScope.top3 = res.data;
                    }).catch(function (e) {
                        return Promise.reject(e);
                    });
            }
            if (!$rootScope.guest) {
                if (!$rootScope.popular2) {
                    let user = localStorageService.get('user').UserName;
                    let token = localStorageService.get('user').token;
                    $http.get('reg/user/twoPopularPoints/' + user, { headers: { 'x-access-token': token } })
                        .then(function (res) {
                            $rootScope.popular2 = res.data;
                        })
                        .catch(function (e) {
                            return Promise.reject(e);
                        });
                }
                if (!$rootScope.latest2) {
                    let user = localStorageService.get('user').UserName;
                    let token = localStorageService.get('user').token;
                    $http.get('reg/user/twoLastPoints/' + user, { headers: { 'x-access-token': token } })
                        .then(function (res) {                         
                            $rootScope.latest2 = res.data;
                        })
                        .catch(function (e) {
                            return Promise.reject(e);
                        });
                }
            }
        };


        service.getRecommendedProducts = function () {
            if (!$rootScope.guest && !$rootScope.recommendedpoints) {
                $http.get('/users/recommandation/' + $rootScope.UserName)
                    .then(function (res) {
                        $rootScope.recommendedpoints = res.data;
                    })
                    .catch(function (e) {
                        return Promise.reject(e);
                    });
            }
        };

        service.getDetails = function () {
            let points = $rootScope.latest2;
            let details=[];
            for (var i = 0; i < points.length; i++) {
                $http.get('point/details/' + points[i].PointID)
                    .then(function (res) {
                        details.append(res.data);
                    })
                    .catch(function (e) {
                        return Promise.reject(e);
                    });
            }
            $rootScope.pointsDetails=details;
        };

        service.login = function (user) {
            return $http.post('auth/login', user)
                .then(function (response) {
                    let token = response.data.token;
                    $http.defaults.headers.common = {
                        'token': token,
                        'user': user.UserName
                    };
                    return Promise.resolve(response);
                })
                .catch(function (e) {
                    return Promise.reject(e);
                });
        };

        service.logout = function () {
            localStorageService.remove('user');
            $location.path("/");
        };
        return service;
    }]);
