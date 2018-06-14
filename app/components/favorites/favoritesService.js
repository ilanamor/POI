

app.factory('cartService', ['$http', 'localStorageService', '$filter', '$rootScope',
    function($http, localStorageService, $filter, $rootScope) {

        let service = {};
        service.selectedCake = null;

        service.addToCart = function (cake) {
            if ($rootScope.guest){
                alert('If you want to shop please log in first!');
            }
            else{
                let valueStored = localStorageService.get($rootScope.UserName);
                if (!valueStored){ // first cake in the cart
                    cake.Amount = 1;
                    localStorageService.set($rootScope.UserName, [cake]);
                    alert('Cake was added successfully');

                } else{
                    var lookup = {};
                    for (var i = 0, len = valueStored.length; i < len; i++) { //look for this cake using lookup table
                        lookup[valueStored[i].CakeID] = valueStored[i];
                    }
                    var exist = lookup[cake.CakeID];
                    if(!exist){ // verify that the cake is not already in the cart
                        cake.Amount = 1;
                        valueStored.push(cake);
                        localStorageService.set($rootScope.UserName,valueStored);
                    }
                    alert('Cake was added successfully');
                }
            }
        };

        return service;
    }]);

