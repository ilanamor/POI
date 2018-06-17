

app.controller('pointsController', ['$scope', '$http','localStorageService','UserService', 'pointsService', '$rootScope','favoritesService','ngDialog',
    function($scope, $http, localStorageService, UserService, pointsService, $rootScope, favoritesService,ngDialog) {
        let self = this;

        self.categoryHeader = "All points";
        self.showAll = true;
        self.sortedOptions =[ { name:'point name', label:'PointName', reverse:false},
                              { name:'Price - low to high', label:'price', reverse:false},
                              { name:'Price - high to low', label:'price', reverse:true}];
        self.filterBy = "";
        self.orderBy = "";
        self.reverseSort = false;

        self.selectedPoint = null;


        let html = '<img ng-src="{{ngDialogData.Pic}}" class="modalImg"/> <br/> '
            + ' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.PointName}}</label>  <br/>  '
            + ' <label class="modalHeader">Rank: </label> <label class="modalText"> {{ngDialogData.Rank}} </label>  <br/>'
            + ' <label class="modalHeader">Num of views: </label> <label class="modalText">{{ngDialogData.NumOfView}}</label> <br/>'
            + ' <label class="modalHeader">Description: </label> <label class="modalText"> {{ngDialogData.Description}}</label> <br/>'
            + ' <label class="modalHeader">Review-1: </label> <label class="modalText"> "{{ngDialogData.Review}}"</label> <br/>'
            + ' <label class="modalHeader">Review-2: </label> <label class="modalText"> "{{ngDialogData.Review2}}"</label> <br/>';
     
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
            self.categoryHeader = CategoryID;
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
