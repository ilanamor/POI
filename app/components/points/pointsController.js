

app.controller('pointsController', ['$scope', '$http','localStorageService','UserService', 'pointsService', '$rootScope','favoritesService',
    function($scope, $http, localStorageService, UserService, pointsService, $rootScope, favoritesService) {
        let self = this;

        self.categoryHeader = "All points";
        self.showAll = true;
        self.sortedOptions =[ { name:'point name', label:'pointName', reverse:false},
                              { name:'Price - low to high', label:'price', reverse:false},
                              { name:'Price - high to low', label:'price', reverse:true}];
        self.filterBy = "";
        self.orderBy = "";
        self.reverseSort = false;

        if(!$rootScope.guest) {
            pointsService.getRecommendedProducts();  // gets all the recommended points
        }
        pointsService.allpoints()
            .then(function(){
                self.points = pointsService.points; // now all the points are save in pointservice.points !

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
            $http.get('/points/byCategory/'+categoryName).then(function (res) {
                self.points = res.data;
            });
            self.orderBy = "";
        };

        self.selectAll = function () {
            self.showAll = true;
            self.categoryHeader = "All points";
            self.points = pointsService.points;
            self.orderBy ="";
        };

        self.addTofavorites = function (point) {
            favoritesService.addTofavorites(point);
        }

    }]);
