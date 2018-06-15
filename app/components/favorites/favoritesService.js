

app.factory('favoritesService', ['$http', 'localStorageService', '$filter', '$rootScope',
    function($http, localStorageService, $filter, $rootScope) {

        let service = {};
        service.selectedpoint = null;

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

        return service;
    }]);

