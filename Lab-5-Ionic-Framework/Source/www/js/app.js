// MyChat App - Ionic & Firebase Demo

var firebaseUrl = "https://sizzling-inferno-3944.firebaseio.com";

function onDeviceReady() {
    angular.bootstrap(document, ["mychat"]);
}
//console.log("binding device ready");
// Registering onDeviceReady callback with deviceready event
document.addEventListener("deviceready", onDeviceReady, false);

// 'mychat.services' is found in services.js
// 'mychat.controllers' is found in controllers.js
angular.module('mychat', ['ionic', 'firebase', 'angularMoment', 'mychat.controllers', 'mychat.services'])

    .run(function ($ionicPlatform, $rootScope, $location, Auth, $ionicLoading) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            // To Resolve Bug
            ionic.Platform.fullScreen();

            $rootScope.firebaseUrl = firebaseUrl;
            $rootScope.displayName = null;

            Auth.$onAuth(function (authData) {
                if (authData) {
                    console.log("Logged in as:", authData.uid);
                } else {
                    console.log("Logged out");
                    $ionicLoading.hide();
                    $location.path('/login');
                }
            });

            $rootScope.logout = function () {
                console.log("Logging out from the app");
                $ionicLoading.show({
                    template: 'Logging Out...'
                });
                Auth.$unauth();
            }


            $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
                // We can catch the error thrown when the $requireAuth promise is rejected
                // and redirect the user back to the home page
                if (error === "AUTH_REQUIRED") {
                    $location.path("/login");
                }
            });
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        console.log("setting config");
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

        // State to represent Login View
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl',
                resolve: {
                    // controller will not be loaded until $waitForAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": ["Auth",
                        function (Auth) {
                            // $waitForAuth returns a promise so the resolve waits for it to complete
                            return Auth.$waitForAuth();
                        }]
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/signup.html',
                controller: 'signupCtrl'
            })


            .state('menu', {
                url: '/side-menu21',
                templateUrl: 'templates/menu.html',
                abstract: true
            })

            .state('menu.home', {
                url: '/home',
                views: {
                    'side-menu21': {
                        templateUrl: 'templates/home.html',
                        controller: 'homeCtrl'
                    }
                }
            })

            .state('menu.profile', {
                url: '/profile',
                views: {
                    'side-menu21': {
                        templateUrl: 'templates/profile.html',
                        controller: 'profileCtrl'
                    }
                }
            })

            .state('welcome', {
                url: '/welcome',
                templateUrl: 'templates/welcome.html',
                controller: 'welcomeCtrl'
            })

            .state('employee-index', {
                url: '/employees',
                templateUrl: 'templates/employee-index.html',
                controller: 'EmployeeIndexCtrl'
            })

            .state('employee-detail', {
                url: '/employee/:employeeId',
                templateUrl: 'templates/employee-detail.html',
                controller: 'EmployeeDetailCtrl'
            })

            .state('employee-reports', {
                url: '/employee/:employeeId/reports',
                templateUrl: 'templates/employee-reports.html',
                controller: 'EmployeeReportsCtrl'
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/welcome');

    });