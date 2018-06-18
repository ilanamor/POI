
'use strict';
//-------------------------------------------------------------------------------------------------------------------
app.controller('favoritesController', ['$scope', '$http','localStorageService', '$rootScope', 'ngDialog','favoritesService','pointsService',
    function($scope, $http, localStorageService, $rootScope, ngDialog, favoritesService) {
        let self = this;
     //   self.Localfavorites = localStorageService.get($rootScope.UserName+'Points');

        let html = '<img ng-src="{{ngDialogData.ImagePath}}" class="modalImg"/> <br/> '
            +' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.pointName}}</label>  <br/>  '
            +' <label class="modalHeader">Price: </label> <label class="modalText"> {{ngDialogData.price}} $ </label>  <br/>'
            +' <label class="modalHeader">Category: </label> <label class="modalText">{{ngDialogData.Category}}</label> <br/>'
            +' <label class="modalHeader">Description: </label> <label class="modalText"> {{ngDialogData.Description}}</label> <br/>'
            +' <label class="modalHeader">Amount in stock: </label> <label class="modalText"> {{ngDialogData.StockAmount}}</label> <br/>';

        self.pointsOrder=[1,2,3];

        self.remove = function (point) {
            let index = self.favorites.indexOf(point);
            self.favorites.splice(index,1);
            localStorageService.set($rootScope.UserName+'Points', self.favorites);
        };

       /* self.favorite = function(){ 
        for (var i = 0, len = Localfavorites.length; i < len; i++) { 
            self.favorites.push(Localfavorites[i]);
        }
    };
     */

        self.pointAmount = function(point){
            if(!point.Amount){
                point.Amount = 1;
            }else if (point.Amount > point.StockAmount){
                point.Amount = point.StockAmount;
            }
            localStorageService.set($rootScope.UserName, self.favorites);
        };


    self.enterOrder = function () {
            $http.put('user/updateFavOrder'+$rootScope.UserName.UserName +self.favorites+ self.pointsOrder ).then(function (res) {
                alert('Favorite`s Order Save Succesfuly!');
            });
           
        };
    
        
        // self.categoryHeader = "All points";
        // self.showAll = true;
        // self.sortedOptions =[ { name:'point name', label:'PointName', reverse:false},
        //                       { name:'Price - low to high', label:'price', reverse:false},
        //                       { name:'Price - high to low', label:'price', reverse:true}];
        // self.filterBy = "";
        // self.orderBy = "";
        // self.reverseSort = false;

     
        favoritesService.allpoints()
             .then(function(){
                 self.points = favoritesService.points; // now all the points are save in pointservice.points !

            });

        self.favorites = function (point) {

                    if (point.inFav === true) {
                        point.inFav = false;
                        favoritesService.removeFromfavorites(point);
                    }
                    else {
                        point.inFav = true;
                        favoritesService.addTofavorites(point);
                    }
                    favoritesService.allpoints()
             .then(function(){
                 self.points = favoritesService.points; // now all the points are save in pointservice.points !

            });

        }

        // $http.get('point/allCategories') // get categories
        //     .then(function (res) {
        //         self.categories = res.data;

        //     }).catch(function (e) {
        //         return Promise.reject(e);
        //     });

        // self.selectCategory = function (CategoryID) {
        //     self.showAll = false;
        //     self.categoryHeader = CategoryID;
        //     $http.get('point/'+CategoryID).then(function (res) {
        //         self.pointsToShow = res.data;
        //     });
        //     self.orderBy = "";
        // };

        // self.selectAll = function () {
        //     self.showAll = true;
        //     self.categoryHeader = "All points";
        //     self.pointsToShow = favoritesService.points;
        //     self.orderBy ="";
        // };
        self.open = function(point) {
            favoritesService.selectedpoint = point;
            ngDialog.open({ template:html,
                            className: 'ngdialog-theme-default',
                            data: favoritesService.selectedpoint,
                            showClose: true,
                            width: 640
            });
        };
    }]);