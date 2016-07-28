var myApp = angular.module('myApp', ['ngRoute', 'ngDialog','ui.router', 'myApp.controllers', 'myApp.services', 'myApp.constants', 'myApp.directives']);


myApp.config(function ($stateProvider, USER_ROLES,$urlRouterProvider) {
    

    $stateProvider
        .state('transaction', {
            url: '/transaction',
            templateUrl: 'partials/transaction.html',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
            }
        })
        .state('product', {
            url: '/product',
            templateUrl: 'partials/product.html',
            data: {
                authorizedRoles: [USER_ROLES.admin]
            }
        })
        .state('expense', {
            url: '/expense',
            templateUrl: 'partials/expense.html',
            data: {
                authorizedRoles: [ USER_ROLES.admin]
            }
        })
        .state('stock', {
            url: '/stock',
            templateUrl: 'partials/stock.html',
            data: {
                authorizedRoles: [USER_ROLES.admin]
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

myApp.run(function ($rootScope, AUTH_EVENTS, AuthService,$state) {
    $rootScope.$on('$stateChangeStart', function (event, next) {

        if ('data' in next && 'authorizedRoles' in next.data) {
            var authorizedRoles = next.data.authorizedRoles;
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
        }
        
    });
});



