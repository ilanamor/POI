
'use strict';
//-------------------------------------------------------------------------------------------------------------------
app.controller('favoritesController', ['$scope', '$http', 'localStorageService', '$rootScope', 'ngDialog', 'favoritesService',
    function ($scope, $http, localStorageService, $rootScope, ngDialog, favoritesService) {
        let self = this;
        self.selectedPoint = null;

        let html = '<img ng-src="{{ngDialogData.Pic}}" class="modalImg"/> <br/> '
            + ' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.PointName}}</label>  <br/>  '
            + ' <label class="modalHeader">Rank: </label> <label class="modalText"> {{ngDialogData.Rank}}% </label>  <br/>'
            + ' <label class="modalHeader">Num of views: </label> <label class="modalText">{{ngDialogData.NumOfView}}</label> <br/>'
            + ' <label class="modalHeader">Description: </label> <label class="modalText"> {{ngDialogData.Description}}</label> <br/>'
            + ' <label class="modalHeader">Review-1: </label> <label class="modalText"> "{{ngDialogData.Review}}"</label> <br/>'
            + ' <label class="modalHeader">Review-2: </label> <label class="modalText"> "{{ngDialogData.Review2}}"</label> <br/>';

      //  self.pointsOrder = "18,10";


        self.enterOrder = function () {
            if( favoritesService.LocalRemoved!=null){
            for (let i = 0; i < favoritesService.LocalRemoved.length; i++) {
                for (let j = 0; j < self.points.length; j++) {
                    if(favoritesService.LocalRemoved[i].PointID===self.points[j].PointID){
                        let p = self.points[j];
                        $http.delete('reg/user/deleteFromFavorite', { UserName:$rootScope.UserName  ,PointID: p.PointID}).catch(function (e) {
                            return Promise.reject(e);
                        });
                    }
                }
                }
            }

           let favToAdd=localStorageService.get($rootScope.UserName + 'Points');
                if(favToAdd!=null){
                for (let i = 0; i < favToAdd.length; i++) {
                    for (let j = 0; j < self.points.length; j++) {
                        if(favToAdd[i].PointID===self.points[j].PointID){
                            let p = self.points[j];
                            $http.post('reg/user/addToFavorite', { UserName:$rootScope.UserName  ,PointID: p.PointID, OrderNum: p.OrderNum}).catch(function (e) {
                             return Promise.reject(e);
                         });
                        }
                    }
                   
                    }
                }
                    let pointAndOrders="";
                 for (let i = 0; i < self.points.length; i++) {
                     pointAndOrders =pointAndOrders+ self.points[i].PointID+','+self.points[i].OrderNum+',';
                 }
            $http.put('reg/user/updateFavOrder', { UserName:$rootScope.UserName  ,pointsOrder: pointAndOrders}).then(function (res) {
                alert('Favorite`s Order Save Succesfuly!');
            });
       //need to clean l.s after delete and 
        };

        favoritesService.allpoints()
            .then(function () {
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
                .then(function () {
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

        self.open = function (point) {
            self.selectedPoint = point;
            $http.put('point/upViews/' + self.selectedPoint.PointID)
                .catch(function (e) {
                    return Promise.reject(e);
                });
            $http.get('point/details/' + self.selectedPoint.PointID)
                .then(function (res) {
                    let pointDetails = res.data[0];
                    if (res.data.length >= 2) {
                        pointDetails.Review2 = res.data[1].Review;
                    }
                    pointDetails["Rank"]=pointDetails["Rank"]*20;
                    ngDialog.open({
                        template: html,
                        className: 'ngdialog-theme-default',
                        data: pointDetails,
                        showClose: true,
                        width: 640
                    });
                })
                .catch(function (e) {
                    return Promise.reject(e);
                });
        };
    }]);