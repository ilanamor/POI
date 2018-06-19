
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

        let htmlReview = '<div ng-controller="pointsController  as pointCtrl">'
            + '<img ng-src="{{ngDialogData.Pic}}" class="modalImg"/> <br/> '
            + ' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.PointName}}</label> <br/> <br/>  '
            + ' <label class="modalHeader">Rank: </label> <input type="number" class="form-control logInput" name="rankInput" ng-model="ngDialogData.rankInput" placeholder="Enter your Rank"> <br/> <br/> '
            + ' <label class="modalHeader">Review: </label> <input type="text" class="form-control logInput" name="reviewInput" ng-model="ngDialogData.reviewInput" placeholder="Enter your Review"> <br/> <br/> '
            + ' <button class="description_button" ng-click="pointCtrl.saveRank(ngDialogData)"> Add </button> <br/> </div>';

        //  self.pointsOrder = "18,10";


        self.enterOrder = function () {
            let favToRem = localStorageService.get($rootScope.UserName + 'Removed');
            if (favToRem != null) {
                for (let i = 0; i < favToRem.length; i++) {
                    let p = favToRem[i];
                    $http({
                        url: 'reg/user/deleteFromFavorite',
                        dataType: "json",
                        method: "DELETE",
                        data: {
                            UserName: $rootScope.UserName, PointID: p.PointID
                        },
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                }
            }


            let favToAdd = localStorageService.get($rootScope.UserName + 'Points');
            if (favToAdd != null) {
                for (let i = 0; i < favToAdd.length; i++) {
                    for (let j = 0; j < self.points.length; j++) {
                        if (favToAdd[i].PointID === self.points[j].PointID) {
                            let p = self.points[j];
                            $http.post('reg/user/addToFavorite', { UserName: $rootScope.UserName, PointID: p.PointID, OrderNum: p.OrderNum }).catch(function (e) {
                                return Promise.reject(e);
                            });
                        }
                    }

                }
            }
            let pointAndOrders = "";
            for (let i = 0; i < self.points.length; i++) {
                pointAndOrders = pointAndOrders + self.points[i].PointID + ',' + self.points[i].OrderNum + ',';
            }
            $http.put('reg/user/updateFavOrder', { UserName: $rootScope.UserName, pointsOrder: pointAndOrders }).then(function (res) {

            });
            localStorageService.remove($rootScope.UserName + 'Points');
            localStorageService.remove($rootScope.UserName + 'Removed');
            alert('Favorite`s Order Save Succesfuly!');
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
                    pointDetails["Rank"] = pointDetails["Rank"] * 20;
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

        self.openRank = function (point) {
            ngDialog.open({
                template: htmlReview,
                className: 'ngdialog-theme-default',
                data: point,
                showClose: true,
                width: 640
            })
        };

        self.saveRank = function (point) {
            if (!(point.rankInput === null && point.reviewInput === '')) {
                $http.post('reg/user/addRankToPoint', { PointID: point.PointID, Rank: point.rankInput, UserName: $rootScope.UserName })
                    .catch(function (e) {
                        return Promise.reject(e);
                    });
                $http.post('reg/user/addReviewToPoint', { PointID: point.PointID, Review: point.reviewInput, UserName: $rootScope.UserName })
                    .catch(function (e) {
                        return Promise.reject(e);
                    });
                point.rankInput = null;
                point.reviewInput = '';
                alert('Rank & Review Saved Succesfuly!');
            }
            else {
                alert('Please enter Rank / Review');
            }

        };

    }]);