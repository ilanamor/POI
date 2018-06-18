

angular.module("pointsOfInterest")
.service('favoritesService', ['$http', 'localStorageService', '$filter', '$rootScope',
    function($http, localStorageService, $filter, $rootScope) {

        let service = {};
        service.selectedpoint = null;
        service.points = [];
        service.serverPoints = {};
        
        //need to show only those who is not in the removed
        service.allpoints = function(){
            let token = localStorageService.get('user').token;
            return $http.get('reg/user/'+$rootScope.UserName,{ headers: { 'x-access-token': token } })
                .then(function (res) {
                    Promise.resolve(res.data);
                    service.points = res.data;
                    for (var i = 0, len = res.data.length; i < len; i++) { //look for this point using lookup table
                        service.serverPoints[res.data[i].PointID] = res.data[i];
                    }
                    service.Localfavorites = localStorageService.get($rootScope.UserName+'Points');
                    //add local favorite
                    if( service.Localfavorites!=null){
                    for (let i = 0, len = service.Localfavorites.length; i < len; i++) { 
                        service.Localfavorites[i].OrderNum=-1;
                        service.points.push(service.Localfavorites[i]);
                    }}

                    //do not show removed points
                    service.LocalRemoved = localStorageService.get($rootScope.UserName+'Removed');
                    if(service.LocalRemoved!=null){
                        let finalPoints = [];
                        let exist=false;
                        for (let i = 0; i< service.points.length; i++) { 
                            for(let j = 0; j< service.LocalRemoved.length; j++){
                                if(service.points[i].PointID===service.LocalRemoved[j].PointID){
                                    exist=true;
                                }
                            }
                            if(!exist){
                                finalPoints.push(service.points[i]);
                            }
                            else{
                                exist=false;
                            }
                        }
                        service.points=finalPoints;
                    }
                    // $rootScope.favoritePoints = service.points;
                })
                .catch(function (e) {
                    return Promise.reject(e);
                });
        };

        //add to local storage
        service.addTofavorites = function (point) {
            if ($rootScope.guest){
                alert('If you want to add a point please log in first!');
            }
            else{
                if(!service.serverPoints[point.PointID]){
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
            } else{

                //remove from Remove localStorage
                service.LocalRemoved = localStorageService.get($rootScope.UserName+'Removed');
                if(service.LocalRemoved!=null){
                    let finalRemoved = [];
                    for (let i = 0; i< service.LocalRemoved.length; i++) { 
                        if(service.LocalRemoved[i].PointID!=point.PointID){
                            finalRemoved.push(service.LocalRemoved[i]);
                        }
                    }
                    localStorageService.set($rootScope.UserName+'Removed',finalRemoved);
                }
                alert('point was added successfully');
            }
        }
        };

        //delete from local sorage
        service.removeFromfavorites = function (point) {
            if ($rootScope.guest){
                alert('If you want to add a point please log in first!');
            }
            else{
                if(service.serverPoints[point.PointID]){
                let valueStored = localStorageService.get($rootScope.UserName+'Removed');
                if (!valueStored){ // first point in the removed
                    localStorageService.set($rootScope.UserName+'Removed', [point]);
                    alert('point was removed successfully');
                } 
                else{
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
            }else{

                //remove from favorite localStorage
                service.Localfavorites = localStorageService.get($rootScope.UserName+'Points');
                if(service.Localfavorites!=null){
                    let finalFavorites = [];
                    for (let i = 0; i< service.Localfavorites.length; i++) { 
                        if(service.Localfavorites[i].PointID!=point.PointID){
                            finalFavorites.push(service.Localfavorites[i]);
                        }
                    }
                    localStorageService.set($rootScope.UserName+'Points',finalFavorites);
                }
                alert('point was removed successfully');
            }
            }
        };

        return service;
    }]);

