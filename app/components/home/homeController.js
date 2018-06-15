'use strict';
//-------------------------------------------------------------------------------------------------------------------
app.controller('productsController', ['$scope', '$http','localStorageService', '$rootScope', 'UserService','favoritesService',
    function($scope, $http, localStorageService, $rootScope, UserService, favoritesService) {
    let self = this;

    UserService.getRandomPoints();

    self.addTofavorites = function (point) {
       favoritesService.addTofavorites(point);
    }
}]);

