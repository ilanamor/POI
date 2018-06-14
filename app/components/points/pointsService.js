
app.factory('pointsService', ['$http', 'localStorageService', '$filter', '$rootScope',
    function($http, localStorageService, $filter, $rootScope) {
        let service = {};
        service.points = [];

        service.getRecommendedProducts = function(){
             return $http.get('/users/recommandation/logged/' + $rootScope.UserName)
                    .then(function (res) {
                        $rootScope.recommendedpoints = res.data;
                        Promise.resolve(res.data);
                    })
                    .catch(function (e) {
                        return Promise.reject(e);
                    });
        };

        service.allpoints = function(){
            return $http.get('/points/')
                .then(function (res) {
                    $rootScope.allpoints = res.data;
                    Promise.resolve(res.data);
                    service.points = res.data;
                })
                .catch(function (e) {
                    return Promise.reject(e);
                });
        };


        return service;
    }]);