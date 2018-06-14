
'use strict';
//-------------------------------------------------------------------------------------------------------------------
app.controller('cartController', ['$scope', '$http','localStorageService', '$rootScope', 'ngDialog','cartService',
    function($scope, $http, localStorageService, $rootScope, ngDialog, cartService) {
        let self = this;
        self.cart = localStorageService.get($rootScope.UserName);

        let html = '<img ng-src="{{ngDialogData.ImagePath}}" class="modalImg"/> <br/> '
            +' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.CakeName}}</label>  <br/>  '
            +' <label class="modalHeader">Price: </label> <label class="modalText"> {{ngDialogData.price}} $ </label>  <br/>'
            +' <label class="modalHeader">Category: </label> <label class="modalText">{{ngDialogData.Category}}</label> <br/>'
            +' <label class="modalHeader">Description: </label> <label class="modalText"> {{ngDialogData.Description}}</label> <br/>'
            +' <label class="modalHeader">Amount in stock: </label> <label class="modalText"> {{ngDialogData.StockAmount}}</label> <br/>';


        self.remove = function (cake) {
            let index = self.cart.indexOf(cake);
            self.cart.splice(index,1);
            localStorageService.set($rootScope.UserName, self.cart);
        };

        self.CakeAmount = function(cake){
            if(!cake.Amount){
                cake.Amount = 1;
            }else if (cake.Amount > cake.StockAmount){
                cake.Amount = cake.StockAmount;
            }
            localStorageService.set($rootScope.UserName, self.cart);
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
            if(self.cart) {
                var total = 0;
                for (var i = 0; i < self.cart.length; i++) {
                    total += self.cart[i].price * self.cart[i].Amount;
                }
                return total;
            }
        };

        self.open = function(cake) {
            cartService.selectedCake = cake;
            ngDialog.open({ template:html,
                            className: 'ngdialog-theme-default',
                            data: cartService.selectedCake,
                            showClose: true,
                            width: 640
            });
        };
    }]);