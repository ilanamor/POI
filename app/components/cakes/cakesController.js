

app.controller('cakesController', ['$scope', '$http','localStorageService','UserService', 'cakesService', '$rootScope','cartService',
    function($scope, $http, localStorageService, UserService, cakesService, $rootScope, cartService) {
        let self = this;

        self.categoryHeader = "All Cakes";
        self.showAll = true;
        self.sortedOptions =[ { name:'Cake name', label:'CakeName', reverse:false},
                              { name:'Price - low to high', label:'price', reverse:false},
                              { name:'Price - high to low', label:'price', reverse:true}];
        self.filterBy = "";
        self.orderBy = "";
        self.reverseSort = false;

        if(!$rootScope.guest) {
            cakesService.getRecommendedProducts();  // gets all the recommended cakes
        }
        cakesService.allCakes()
            .then(function(){
                self.cakes = cakesService.cakes; // now all the cakes are save in cakeService.cakes !

            });
        $http.get('/categories') // get categories
            .then(function (res) {
                self.categories = res.data;

            }).catch(function (e) {
                return Promise.reject(e);
            });

        self.selectCategory = function (categoryName) {
            self.showAll = false;
            self.categoryHeader = categoryName;
            $http.get('/cakes/byCategory/'+categoryName).then(function (res) {
                self.cakes = res.data;
            });
            self.orderBy = "";
        };

        self.selectAll = function () {
            self.showAll = true;
            self.categoryHeader = "All Cakes";
            self.cakes = cakesService.cakes;
            self.orderBy ="";
        };

        self.addToCart = function (cake) {
            cartService.addToCart(cake);
        }

    }]);
