
angular.module("pointsOfInterest")
.service('pointsService', ['$http', 'localStorageService', '$filter', '$rootScope',
    function($http, localStorageService, $filter, $rootScope) {
        let service = {};
        service.points = [];

        service.allpoints = function(){
            return $http.get('/point/')
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