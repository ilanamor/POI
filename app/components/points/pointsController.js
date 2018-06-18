

app.controller('pointsController', ['$scope', '$http', 'localStorageService', 'UserService', 'pointsService', '$rootScope', 'favoritesService', 'ngDialog',
    function ($scope, $http, localStorageService, UserService, pointsService, $rootScope, favoritesService, ngDialog) {
        let self = this;

        self.categoryHeader = "All points";
        self.showAll = true;
        self.sortedOptions = [{ name: 'point name', label: 'PointName', reverse: false },
        { name: 'Price - low to high', label: 'price', reverse: false },
        { name: 'Price - high to low', label: 'price', reverse: true }];
        self.filterBy = "";
        self.orderBy = "";
        self.reverseSort = false;

        self.selectedPoint = null;
        self.currentFavorites = null;


        let html = '<img ng-src="{{ngDialogData.Pic}}" class="modalImg"/> <br/> '
            + ' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.PointName}}</label> <br/>  '
            + ' <label class="modalHeader">Rank: </label> <label class="modalText"> {{ngDialogData.Rank}}% </label> <br/>'
            + ' <label class="modalHeader">Num of views: </label> <label class="modalText">{{ngDialogData.NumOfView}}</label> <br/>'
            + ' <label class="modalHeader">Description: </label> <label class="modalText"> {{ngDialogData.Description}}</label> <br/>'
            + ' <label class="modalHeader">Review-1: </label> <label class="modalText"> "{{ngDialogData.Review}}"</label> <br/>'
            + ' <label class="modalHeader">Review-2: </label> <label class="modalText"> "{{ngDialogData.Review2}}"</label> <br/>';

        let htmlReview = '<div ng-controller="pointsController  as pointCtrl">'
            + '<img ng-src="{{ngDialogData.Pic}}" class="modalImg"/> <br/> '
            + ' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.PointName}}</label> <br/> <br/>  '
            + ' <label class="modalHeader">Rank: </label> <input type="text" class="form-control logInput" name="rankInput" placeholder="Enter your Rank"> <br/> <br/> '
            + ' <label class="modalHeader">Review: </label> <input type="text" class="form-control logInput" name="reviewInput" placeholder="Enter your Review"> <br/> <br/> ' 
            + ' <button class="description_button" ng-click="pointCtrl.saveRank(ngDialogData,rankInput,reviewInput)"> Add </button> <br/> </div>' ;

        pointsService.allpoints()
            .then(function () {
                self.points = pointsService.points; // now all the points are save in pointservice.points !
                favoritesService.allpoints()
                    .then(function () {
                        if (!$rootScope.guest) {
                            self.currentFavorites = favoritesService.points; // now all the points are save in pointservice.points !
                            for (let i = 0; i < self.points.length; i++) {
                                for (let j = 0; j < self.currentFavorites.length; j++) {
                                    if (self.points[i].PointID === self.currentFavorites[j].PointID) {
                                        self.points[i].inFav = true;
                                        break;
                                    }
                                    else {
                                        self.points[i].inFav = false;
                                    }
                                }
                            }
                        }
                        else {
                            for (let i = 0; i < self.points.length; i++) {
                                self.points[i].inFav = false;
                            }
                        }

                    })
            });

        $http.get('point/allCategories') // get categories
            .then(function (res) {
                self.categories = res.data;

            }).catch(function (e) {
                return Promise.reject(e);
            });

        self.selectCategory = function (CategoryID) {
            self.showAll = false;
            self.categoryHeader = CategoryID;
            $http.get('point/' + CategoryID).then(function (res) {
                self.points = res.data;
            });
            self.orderBy = "";
        };

        self.selectAll = function () {
            self.showAll = true;
            self.categoryHeader = "All points";
            self.points = pointsService.points;
            self.orderBy = "";
        };

        self.favorites = function (point) {
            if (!$rootScope.guest) {
                if (point.inFav === true) {
                    point.inFav = false;
                    favoritesService.removeFromfavorites(point);
                }
                else {
                    point.inFav = true;
                    favoritesService.addTofavorites(point);
                }
            }
            else {
                alert('If you want to add a point please log in first!');
            }
        }


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

        self.saveRank = function (point,rankInput,reviewInput) {
            let x;
            $http.post('/addReviewToPoint')
                .catch(function (e) {
                    return Promise.reject(e);
                });
            $http.post('/addRankToPoint')
                .catch(function (e) {
                    return Promise.reject(e);
                });
        };


    }]);
