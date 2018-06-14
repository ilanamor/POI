'use strict';
//-------------------------------------------------------------------------------------------------------------------
app.controller('productsController', ['$scope', '$http','localStorageService', '$rootScope', 'UserService','favoritesService',
    function($scope, $http, localStorageService, $rootScope, UserService, favoritesService) {
    let self = this;

    UserService.getUserProducts();

    self.addToCart = function (point) {
       cartService.addToCart(point);
    }
}]);

