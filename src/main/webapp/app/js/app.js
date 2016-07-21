var myApp = angular.module('myApp', ['ngRoute', 'ngDialog','ui.router', 'myApp.controllers', 'myApp.services', 'myApp.constants', 'myApp.directives']);
// myApp.config(function($routeProvider) {
//     $routeProvider
//         .when('/books', {templateUrl: 'partials/books.html', controller: 'BookListCtrl'})
//         .otherwise({redirectTo: '/'});
//     // $httpProvider.defaults.useXDomain = true;
//     // delete $httpProvider.defaults.headers.common["X-Requested-With"];
//     // console.log('@X-Requested-With@'+$httpProvider.defaults.headers.common["X-Requested-With"])
// });

// myApp.config(['$routeProvider',
//     function ($routeProvider) {
//         $routeProvider.when('/books', {templateUrl: 'partials/books.html'})
//             .when('/roood', {templateUrl: 'partials/roood.html'})
//             .when('/transaction', {templateUrl: 'partials/transaction.html'})
//             .when('/report_transaction', {templateUrl: 'partials/report_transaction.html'})
//             .otherwise({redirectTo: '/'});
//         //$locationProvider.html5Mode(true); //Remove the '#' from URL.
//     }
// ]);

myApp.config(function ($stateProvider, USER_ROLES) {
    $stateProvider
        .state('transaction', {
            url: '/transaction',
            templateUrl: 'partials/transaction.html',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
            }
        })
        .state('roood', {
            url: '/roood',
            templateUrl: 'partials/roood.html',
            data: {
                authorizedRoles: [ USER_ROLES.editor]
            }
        });
});

myApp.run(function ($rootScope, AUTH_EVENTS, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
        console.log("tests");
        var authorizedRoles = next.data.authorizedRoles;
        console.log(AuthService.isAuthorized(authorizedRoles));
        if (!AuthService.isAuthorized(authorizedRoles)) {
            event.preventDefault();
            if (AuthService.isAuthenticated()) {
                // user is not allowed
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            } else {
                // user is not logged in
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }
    });
});



