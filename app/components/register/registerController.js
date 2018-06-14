'use strict';

app.controller('registerController', ['$scope', '$location', '$window', '$http',
    function($scope, $location, $window, $http) {
        let self = this;
        self.user = {UserName: '', Password: '', FirstName: '', LastName: '' , Address: '',
            City: '', Country: '', Phone: '', Mail: '',CreditCardNumber: '', isADmin: 0
            , Question1: '', Question2: '', Answer1: '', Answer2: '', Category1: ''
            ,Category2: '', Category3: ''};
        self.Countries = [];

        loadXMLDoc(); // load cuntries document

        $http.get('/categories') // get categories
            .then(function (res) {
                self.categories = res.data;
            })
            .catch(function (e) {
                return Promise.reject(e);
            });

        self.register = function(valid) { // submit registration
            if (valid) {
                $http.post('users/register',self.user).then(function (success) {
                    $window.alert('Register Successfully');
                    $location.path('/login');
                }, function (error) {
                    $window.alert('User name exist, please choose another user name ');
                })
            }
        };

        function loadXMLDoc() {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    findCountries(this);
                }
            };
            xmlhttp.open("GET", "../../shared/countries.xml", true);
            xmlhttp.send();
        }
        function findCountries(xml) {
            var i;
            var xmlDoc = xml.responseXML;
            var temp = [];
            var x = xmlDoc.getElementsByTagName("Country");
            for (i = 0; i <x.length; i++) {
                var json = { "ID" :x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue.toString(),
                    "Name" :x[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue.toString()}
                temp.push(json);
            }
            self.Countries = temp;
        }

    }]);