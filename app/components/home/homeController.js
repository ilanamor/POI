'use strict';
//-------------------------------------------------------------------------------------------------------------------
app.controller('productsController', ['$scope', '$http','localStorageService', '$rootScope', 'UserService','cartService',
    function($scope, $http, localStorageService, $rootScope, UserService, cartService) {
    let self = this;

    UserService.getUserProducts();

    self.addToCart = function (cake) {
       cartService.addToCart(cake);
    }
}]);

