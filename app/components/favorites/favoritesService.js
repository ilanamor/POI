

angular.module("pointsOfInterest")
.service('favoritesService', ['$http', 'localStorageService', '$filter', '$rootScope',
    function($http, localStorageService, $filter, $rootScope) {

        let service = {};
        service.selectedpoint = null;
        service.points = [];
        
        //need to show only those who is not in the removed
        service.allpoints = function(){
            let token = localStorageService.get('user').token;
            return $http.get('reg/user/'+$rootScope.UserName,{ headers: { 'x-access-token': token } })
                .then(function (res) {
                    Promise.resolve(res.data);
                    service.points = res.data;
                    service.Localfavorites = localStorageService.get($rootScope.UserName+'Points');
                    if( service.Localfavorites!=null){
                    for (let i = 0, len = service.Localfavorites.length; i < len; i++) { 
                        service.Localfavorites[i].OrderNum=-1;
                        service.points.push(service.Localfavorites[i]);
                    }}
                    // $rootScope.favoritePoints = service.points;
                })
                .catch(function (e) {
                    return Promise.reject(e);
                });
        };

        //need to check if the point we want to add is not in the removed
        service.addTofavorites = function (point) {
            if ($rootScope.guest){
                alert('If you want to add a point please log in first!');
            }
            else{
                let valueStored = localStorageService.get($rootScope.UserName+'Points');
                if (!valueStored){ // first point in the favorites
                    point.Amount = 1;
                    localStorageService.set($rootScope.UserName+'Points', [point]);
                    alert('point was added successfully');

                } else{
                    var lookup = {};
                    for (var i = 0, len = valueStored.length; i < len; i++) { //look for this point using lookup table
                        lookup[valueStored[i].PointID] = valueStored[i];
                    }
                    var exist = lookup[point.PointID];
                    if(!exist){ // verify that the point is not already in the favorites
                        point.Amount=1;
                        valueStored.push(point);
                        localStorageService.set($rootScope.UserName+'Points',valueStored);
                    }
                    alert('point was added successfully');
                }
            }
        };

        service.removeFromfavorites = function (point) {
            if ($rootScope.guest){
                alert('If you want to add a point please log in first!');
            }
            else{
                let valueStored = localStorageService.get($rootScope.UserName+'Removed');
                if (!valueStored){ // first point in the removed
                    localStorageService.set($rootScope.UserName+'Removed', [point]);
                    alert('point was removed successfully');
                } else{
                    var lookup = {};
                    for (var i = 0, len = valueStored.length; i < len; i++) { //look for this point using lookup table
                        lookup[valueStored[i].PointID] = valueStored[i];
                    }
                    var exist = lookup[point.PointID];
                    if(!exist){ // verify that the point is not already in the removed
                        valueStored.push(point);
                        localStorageService.set($rootScope.UserName+'Removed',valueStored);
                    }
                    alert('point was removed successfully');
                }
            }
        };

        return service;
    }]);

