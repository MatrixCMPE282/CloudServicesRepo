var myApp = angular.module('myApp', ['ngRoute', 'ngResource']);

myApp.config(function ($routeProvider) {
    
   $routeProvider

   .when('/', {
       templateUrl: '/register.html',
       controller: 'maincontroller'
   })

   .when('/login', {
       templateUrl: '/login.html',
       controller: 'logincontroller'
   })
   
   .when('/logout', {
      controller: 'logoutController'
    })

   .when('/register', {
       templateUrl: '/register.html',
       controller: 'maincontroller'
   })

   .when('/first', {
       templateUrl: '/pages/first.html',
       controller: 'firstcontroller'
   })
    
   
   .when('/help', {
       templateUrl: '/pages/help.html'
   })
   
   .when('/profile', {
       templateUrl: '/pages/profile.html',
       controller: 'profilecontroller'
   })

});

myApp.factory('AuthService',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http, localStorageService) {

            // create user variable
            var user = null;
            var err = "";
            var uname = "";
            var email = "";
            var city = "";

            // return available functions for use in controllers
            return ({
                isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                login: login,
                logout: logout,
                register: register,
                getError: getError,
                getUserName: getUserName,
                getEmail: getEmail,
                getCity: getCity
            });

            function isLoggedIn() {
                if(user) {
                    return true;
                } else {
                    return false;
                }
            }

            function getUserStatus() {
                return user;
            }

            function getError() {
                return err;
            }

            function getUserName() {
                return uname;
            }

            function getEmail() {
                return email;
            }

            function getCity() {
                return city;
            }

            function login(username, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/login', {username: username, password: password})
                    // handle success
                    .success(function (data, status) {
                        if(status === 200 && data.status){
                            console.log(data);
                            user = true;
                            uname = data.username;
                            email = data.email;
                            city = data.city;
                            err = "";
                            deferred.resolve();
                        } else {
                            user = false;
                            err = "Something went wrong, please try again!";
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                        console.log(data.status);
                        err = data.status;
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function logout() {

             // create a new instance of deferred
             var deferred = $q.defer();

             // send a get request to the server
             $http.get('/logout')
                 // handle success
                 .success(function (data) {
                 user = false;
                 deferred.resolve();
                 })
                 // handle error
                 .error(function (data) {
                 user = false;
                 deferred.reject();
             });

             // return promise object
             return deferred.promise;

             }

            function register(username, password, email, city) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/register', {username: username, password: password, email: email, city: city})
                    // handle success
                    .success(function (data, status) {
                        if(status === 200 && data.status){
                          //  debugger;
                            user = true;
                            err = "";
                            deferred.resolve();
                        } else {
                           // debugger;
                            user = false;
                            err = "Something went wrong, please try again!";
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                       // debugger;
                        user = false;
                        err = data.status;
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;
            }

        }]);

//Services
myApp.service('cityService', function() {

    this.city = "";
    
});


//Controllers
myApp.controller('maincontroller', ['$scope','$http', '$location', 'AuthService', function($scope, $http, $location, AuthService) {
    
    var refresh = function(){
        console.log("Refresh called");
        $scope.contact = "";
        $scope.errorMessage = "";
    };

    refresh();

    $scope.navLogin = function() {
        console.log("Navigating to login page");
        $location.path('/login');
    };

    $scope.addContact = function () {
       // debugger;
        console.log($scope.contact);

        // initial values
        $scope.error = false;
        $scope.disabled = true;

        // call register from service
        AuthService.register($scope.contact.username, $scope.contact.password, $scope.contact.email, $scope.contact.city)
            // handle success
            .then(function () {
                //debugger;
                console.log("Registered succesfully");
                $location.path('/login');
                $scope.disabled = false;
                $scope.contact = {};
            })
            // handle error
            .catch(function () {
                //debugger;
                $scope.error = true;
                $scope.errorMessage = AuthService.getError();
                console.log($scope.errorMessage);
                $scope.disabled = false;
                $scope.contact = {};
            });
    };

}]);


myApp.controller('logincontroller', ['$scope','$http', '$location', 'AuthService', function($scope, $http, $location, AuthService) {

    var refresh = function(){
        $scope.login = "";
        $scope.errorMessage = "";
    };

    refresh();

    console.log(AuthService.getUserStatus());

    $scope.loginUser = function () {

        // initial values
        $scope.error = false;
        $scope.disabled = true;

        // call login from service
        AuthService.login($scope.login.username, $scope.login.password)
            // handle success
            .then(function () {
                $location.path('/first');
                $scope.disabled = false;
                $scope.login = {};
            })
            // handle error
            .catch(function () {
                $scope.error = true;
                $scope.errorMessage = AuthService.getError();
                $scope.disabled = false;
                $scope.login = {};
            });

    };
    
}]);

myApp.controller('logoutcontroller', ['$scope','$http', '$location', 'AuthService', function($scope, $http, $location, AuthService) {

    $scope.logout = function () {

        AuthService.logout()
            .then(function () {
                $location.path('/login');
            });
    };
}]);



myApp.controller('firstcontroller', ['$scope','$resource','$routeParams', '$location', 'cityService', 'AuthService', function($scope, $resource, $routeParams, $location, cityService, AuthService) {

    //$scope.city = cityService.city;
    $scope.$watch('city', function() {
        cityService.city = $scope.city;
    });
    
    //$scope.city = cityService.city;

    $scope.city = AuthService.getCity();
    $scope.username = AuthService.getUserName();

    $scope.days = $routeParams.days || 1;
    
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?q=?&appid=c118247eb16c3dc6f7820ced2fbc09ae", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});

    var showWeather = function() {
        $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days });
    };

    $scope.getWeather = function(){
        $scope.city = cityService.city;
        showWeather();
    };

    showWeather();
    //$scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days });
    
    console.log($scope.weatherResult);
    
    $scope.convertToCelcius = function(degK) {
        return Math.round(((degK - 273)));
    };
    
    $scope.convertToDate = function(dt) {
        return new Date(dt * 1000).toLocaleDateString();
    };

     $scope.nyAPI = $resource("http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1.jsonp?api-key=df27e0331b892c64c9ac8fef005b0460:14:73599337", { callback: "JSON_CALLBACK" },{ get: { method: "JSONP" }});
    
    $scope.newsResult = $scope.nyAPI.get();
    
    console.log($scope.newsResult);
    
}]);


myApp.controller('profilecontroller', ['$scope', '$log', '$location','AuthService', function($scope, $log, $location, AuthService) {

    $scope.username = AuthService.getUserName();
    $scope.email = AuthService.getEmail();
    $scope.city = AuthService.getCity();
    
}]);
