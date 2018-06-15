'use strict';
//-------------------------------------------------------------------------------------------------------------------
app.controller('productsController', ['$scope', '$http','localStorageService', '$rootScope', 'UserService','favoritesService','ngDialog',
    function($scope, $http, localStorageService, $rootScope, UserService, favoritesService,ngDialog) {
    let self = this;

    let html = '<img ng-src="{{ngDialogData.Pic}}" class="modalImg"/> <br/> '
            +' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.PointName}}</label>  <br/>  '
            +' <label class="modalHeader">Rank: </label> <label class="modalText"> {{ngDialogData.Rank}} </label>  <br/>'
            +' <label class="modalHeader">Num of views: </label> <label class="modalText">{{ngDialogData.NumOfView}}</label> <br/>'
            +' <label class="modalHeader">Description: </label> <label class="modalText"> {{ngDialogData.Description}}</label> <br/>'
            +' <label class="modalHeader">Review-1: </label> <label class="modalText"> "{{ngDialogData.Review}}"</label> <br/>'
            +' <label class="modalHeader">Review-2: </label> <label class="modalText"> "{{ngDialogData.Review2}}"</label> <br/>';

    UserService.getRandomPoints();

    self.addTofavorites = function (point) {
       favoritesService.addTofavorites(point);
    }

    self.open = function(PointID) {
        $http.put('point/upViews/' + PointID)
                    .catch(function (e) {
                        return Promise.reject(e);
                    });

        $http.get('point/details/' + PointID)
                    .then(function (res) {
                        let data = res.data[0];
                        if(res.data.length===2){
                        data.Review2= res.data[1].Review;}
                        ngDialog.open({ template:html,
                            className: 'ngdialog-theme-default',
                            data: res.data[0],
                            showClose: true,
                            width: 640
            });
                    })
                    .catch(function (e) {
                        return Promise.reject(e);
                    });
        
    };

}]);

