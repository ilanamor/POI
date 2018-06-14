

app.controller('pointsController', ['$scope', '$http','localStorageService','UserService', 'pointsService', '$rootScope','favoritesService',
    function($scope, $http, localStorageService, UserService, pointsService, $rootScope, favoritesService) {
        let self = this;

        self.categoryHeader = "All points";
        self.showAll = true;
        self.sortedOptions =[ { name:'point name', label:'PointName', reverse:false},
                              { name:'Price - low to high', label:'price', reverse:false},
                              { name:'Price - high to low', label:'price', reverse:true}];
        self.filterBy = "";
        self.orderBy = "";
        self.reverseSort = false;

     
        pointsService.allpoints()
            .then(function(){
                self.points = pointsService.points; // now all the points are save in pointservice.points !

            });

        $http.get('point/allCategories') // get categories
            .then(function (res) {
                self.categories = res.data;

            }).catch(function (e) {
                return Promise.reject(e);
            });

        self.selectCategory = function (CategoryID) {
            self.showAll = false;
            self.categoryHeader = CategoryName;
            $http.get('point/'+CategoryID).then(function (res) {
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
