
'use strict';
//-------------------------------------------------------------------------------------------------------------------
app.controller('favoritesController', ['$scope', '$http','localStorageService', '$rootScope', 'ngDialog','favoritesService',
    function($scope, $http, localStorageService, $rootScope, ngDialog, favoritesService) {
        let self = this;
        self.favorites = localStorageService.get($rootScope.UserName+'Points');

        let html = '<img ng-src="{{ngDialogData.ImagePath}}" class="modalImg"/> <br/> '
            +' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.pointName}}</label>  <br/>  '
            +' <label class="modalHeader">Price: </label> <label class="modalText"> {{ngDialogData.price}} $ </label>  <br/>'
            +' <label class="modalHeader">Category: </label> <label class="modalText">{{ngDialogData.Category}}</label> <br/>'
            +' <label class="modalHeader">Description: </label> <label class="modalText"> {{ngDialogData.Description}}</label> <br/>'
            +' <label class="modalHeader">Amount in stock: </label> <label class="modalText"> {{ngDialogData.StockAmount}}</label> <br/>';

        self.pointsOrder=[1,2];

        self.remove = function (point) {
            let index = self.favorites.indexOf(point);
            self.favorites.splice(index,1);
            localStorageService.set($rootScope.UserName+'Points', self.favorites);
        };


        self.pointAmount = function(point){
            if(!point.Amount){
                point.Amount = 1;
            }else if (point.Amount > point.StockAmount){
                point.Amount = point.StockAmount;
            }
            localStorageService.set($rootScope.UserName, self.favorites);
        };


    self.enterOrder = function () {
            $http.get('user/updateFavOrder'+$rootScope.UserName.UserName +self.favorites+ self.pointsOrder ).then(function (res) {
                alert('Favorite`s Order Save Succesfuly!');
            });
           
        };
        self.pay = function(){
            var order =
                { UserName: $rootScope.UserName,
                    OrderDate: new Date(),
                    ShipmentDate: "", // MISSING!!
                    Dollar: "",
                    TotalAmount: 0
            };
            alert('This option will exist in the next version');
         //   $http.post('/addOrder')
        };

        self.getTotal = function () {
            if(self.favorites) {
                var total = 0;
                for (var i = 0; i < self.favorites.length; i++) {
                    total += self.favorites[i].price * self.favorites[i].Amount;
                }
                return total;
            }
        };

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