'use strict';

var app = angular.module('CakesShop', [ 'ngRoute', 'LocalStorageModule', 'ngDialog']);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);

app.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: true,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true
    });
}]);

app.config(['$qProvider', function ($qProvider) { //
    $qProvider.errorOnUnhandledRejections(false);
}]);

app.controller('mainController', ['$scope', 'UserService', '$location', '$window', '$http','localStorageService',
    '$filter', '$rootScope',
    function($scope, UserService, $location, $window,  $http, localStorageService, $filter, $rootScope) {
    let self = this;

    UserService.initUser($rootScope);

    self.logout = function () {
        UserService.logout();
        UserService.initUser($rootScope);
    };

}]);

//-------------------------------------------------------------------------------------------------------------------
app.config( ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "./components/home/home.html"})
        .when("/login", {
            templateUrl : "./components/login/login.html"})
        .when("/register", {
            templateUrl : "./components/register/register.html"
        }).when("/cakes", {
        templateUrl : "./components/cakes/cakes.html"
    }).when("/about", {
        templateUrl : "./shared/about.html"
    }).when("/cart", {
        templateUrl : "./components/cart/cart.html"
    }).otherwise({
        redirectTo : "/"
    });
}]);
//-------------------------------------------------------------------------------------------------------------------
