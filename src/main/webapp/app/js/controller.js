/**
 * Created by arach on 7/19/2016.
 */

    var as = angular.module('myApp.controllers', []);

as.controller('MainController', function($scope,$rootScope, AuthService, USER_ROLES,ngDialog,$state) {
    $rootScope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;


    $scope.login = function(){
        ngDialog.open({
            template: 'partials/login.html',
            controller: 'LoginCtrl',
            preCloseCallback:function(){
                // $scope.currentUser = $rootScope.currentUser;
            }
        });
    }

    $scope.testC = function(){
        console.log("test123");
        $state.go('transaction');
    }


});
as.controller('LoginCtrl', function($scope, $rootScope, AUTH_EVENTS, AuthService) {

    $scope.credentials = {
        username: '',
        password: ''
    };
    $scope.login = function (credentials) {
        AuthService.login(credentials).then(function (user) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $rootScope.currentUser = user;
            $scope.closeThisDialog('');
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
});

as.controller('BookListCtrl', function($scope) {

        $scope.message = "Books";
        $scope.name = '';

    });
as.controller('RooodListCtrl', function($scope) {

    $scope.message = "Rooodroood";
    $scope.name = '';

});

as.controller('TransactionCtrl', function($scope,WDService,ngDialog) {

    $scope.loadTransaction = function(){
        WDService.getTransactionTodaySell().then(function(resp){
            $scope.transactions = resp.data;
            $scope.summary = 0;
            for(var i = 0; i < resp.data.length; i++){
                $scope.summary = resp.data[i].sellPrice + $scope.summary
            }
        });
    }

    $scope.loadTransaction();


    $scope.addSell = function(){
        ngDialog.open({
            template: 'partials/add_sell.html',
            controller: 'AddSellCtrl',
            preCloseCallback:function(){
                $scope.loadTransaction();
            }
        });
    }

    $scope.message = "Rooodroood";
    $scope.name = '';

});

as.controller('AddSellCtrl', function($scope,WDService) {
    WDService.getProduct().then(function(resp){
        $scope.products = resp.data;
        $scope.selectedProduct = resp.data[1].id;
    });

    $scope.save = function(){
        WDService.saveTransaction($scope.selectedProduct,0,$scope.quantity,$scope.price).then(function(resp){
            $scope.closeThisDialog('');
        });
    }
});

as.controller('AddBuyCtrl', function($scope,WDService) {
    WDService.getProduct().then(function(resp){
        $scope.products = resp.data;
        $scope.selectedProduct = resp.data[1].id;
    });

    $scope.save = function(){
        WDService.saveTransaction($scope.selectedProduct,$scope.price,$scope.quantity,0).then(function(resp){
            $scope.closeThisDialog('');
        });
    }
});

as.controller('ReportTransactionCtrl', function($scope,WDService) {
    $scope.loadTransaction = function(){
        WDService.getTransactionTodaySell().then(function(resp){
            $scope.transactions = resp.data;
            $scope.summary = 0;
            for(var i = 0; i < resp.data.length; i++){
                $scope.summary = resp.data[i].sellPrice + $scope.summary
            }
        });
    }

    $scope.loadTransaction();
});