/**
 * Created by arach on 7/19/2016.
 */

    var as = angular.module('myApp.controllers', []);

as.controller('MainController', function($scope,$rootScope, AuthService, USER_ROLES,ngDialog,$state) {
    if(!AuthService.isAuthenticated()){
        $rootScope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;
    }else{
        $rootScope.currentUser = AuthService.getUser();
    }


    $scope.login = function(){
        ngDialog.open({
            template: 'partials/login.html',
            controller: 'LoginCtrl',
            preCloseCallback:function(){
                // $scope.currentUser = $rootScope.currentUser;
            }
        });
    }
    $scope.logout = function(){
        AuthService.logout();
        $rootScope.currentUser = null;
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

as.controller('TransactionCtrl', function($scope,WDService,ngDialog,USER_ROLES,AuthService) {
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.load = function(){
        WDService.getTransactionTodaySell().then(function(resp){
            $scope.transactions = resp.data;
            $scope.summary = 0;
            $scope.summaryBuy = 0;
            for(var i = 0; i < resp.data.length; i++){
                $scope.summary = resp.data[i].sellPrice + $scope.summary
                $scope.summaryBuy = resp.data[i].buyPrice + $scope.summaryBuy
            }
        });
    }
    $scope.load();
    $scope.addSell = function(){
        ngDialog.open({
            template: 'partials/add_sell.html',
            controller: 'AddSellCtrl',
            preCloseCallback:function(){
                $scope.load();
            }
        });
    }

    $scope.edit = function(transaction){
        $scope.trans = transaction
        ngDialog.open({
            template: 'partials/add_sell.html',
            controller: 'AddSellCtrl',
            scope: $scope,
            preCloseCallback:function(){
                $scope.load();
            }
        });
    }

    $scope.delete = function(trans){
        WDService.deleteTransaction(trans.id).then(function(resp){
            $scope.load();
        });
    }

    $scope.stock = function () {
        WDService.updateStock().then(function (resp) {
            $scope.load();
        });
    }
});

function getDateString(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var hour = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    return yyyy+'-'+mm+'-'+dd+'T'+hour+':'+min+':'+sec+'Z';
}

as.controller('AddSellCtrl', function ($scope, WDService, USER_ROLES, AuthService, $parse) {
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
    if($scope.trans){
        $scope.mode = 'edit';
    }else{
        $scope.mode = 'new';
    }
    WDService.getProduct().then(function(resp){
        $scope.products = resp.data;
        var the_string = 'trans.product.id';
        var model = $parse(the_string);
        model.assign($scope, resp.data[1].id);
        $scope.productMap = new Object();
        $scope.trans.quantity = 1;
        $scope.trans.sellPrice = resp.data[1].sellPrice;
        angular.forEach($scope.products, function (value, key) {
            $scope.productMap[value.id] = value.sellPrice
        });

        // $scope.trans.product.id = resp.data[1].id;
    });

    $scope.change = function () {
        $scope.trans.sellPrice = $scope.trans.quantity * $scope.productMap[$scope.trans.product.id];
    }

    $scope.save = function(){
        if($scope.mode=='new') {
            $scope.trans.datetime = getDateString();
            WDService.createTransaction($scope.trans).then(function (resp) {
                $scope.closeThisDialog('');
            });
        }else{
            $scope.trans.datetime = getDateString();
            WDService.editTransaction($scope.trans).then(function (resp) {
                $scope.closeThisDialog('');
            });
        }
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

as.controller('ProductCtrl', function($scope,WDService,ngDialog) {
    console.log(new Date());
    $scope.load = function(){
        WDService.getProduct().then(function(resp){
            $scope.products = resp.data;

        });
    }

    $scope.load();

    $scope.add = function(){
        ngDialog.open({
            template: 'partials/add_product.html',
            controller: 'AddProductCtrl',
            preCloseCallback:function(){
                $scope.load();
            }
        });
    }

    $scope.edit = function(product){
        $scope.product = product

        ngDialog.open({
            template: 'partials/add_product.html',
            controller: 'AddProductCtrl',
            scope: $scope,
            preCloseCallback:function(){
                $scope.load();
            }
        });
    }

    $scope.delete = function(product){
        WDService.deleteProduct(product.id).then(function(resp){
            $scope.load();
        });
    }

});

as.controller('AddProductCtrl', function($scope,WDService) {
    if($scope.product){
        $scope.mode = 'edit';
    }else{
        $scope.mode = 'new';
    }

    $scope.save = function(){
        if($scope.mode=='new') {
            WDService.createProduct($scope.product).then(function (resp) {
                $scope.closeThisDialog('');
            });
        }else{
            WDService.editProduct($scope.product).then(function (resp) {
                $scope.closeThisDialog('');
            });
        }
    }
});

as.controller('ExpenseCtrl', function($scope,WDService,ngDialog) {

    $scope.load = function(){
        WDService.getExpenseToday().then(function(resp){
            $scope.expenses = resp.data;
            $scope.summary = 0;
            for(var i = 0; i < resp.data.length; i++){
                $scope.summary = resp.data[i].amount + $scope.summary
            }
        });
    }
    $scope.load();
    $scope.add = function(){
        ngDialog.open({
            template: 'partials/add_expense.html',
            controller: 'AddExpenseCtrl',
            preCloseCallback:function(){
                $scope.load();
            }
        });
    }

    $scope.edit = function(expense){
        $scope.expense = expense
        ngDialog.open({
            template: 'partials/add_expense.html',
            controller: 'AddExpenseCtrl',
            scope: $scope,
            preCloseCallback:function(){
                $scope.load();
            }
        });
    }

    $scope.delete = function(expense){
        WDService.deleteExpense(expense.id).then(function(resp){
            $scope.load();
        });
    }
});

as.controller('AddExpenseCtrl', function($scope,WDService) {
    if($scope.expense){
        $scope.mode = 'edit';
    }else{
        $scope.mode = 'new';
    }

    $scope.save = function(){
        if($scope.mode=='new') {
            $scope.expense.datetime = getDateString();
            WDService.createExpense($scope.expense).then(function (resp) {
                $scope.closeThisDialog('');
            });
        }else{
            $scope.expense.datetime = getDateString();
            WDService.editExpense($scope.expense).then(function (resp) {
                $scope.closeThisDialog('');
            });
        }
    }
});

as.controller('StockCtrl', function ($scope, WDService, ngDialog) {
    $scope.load = function () {
        WDService.getLatestStock().then(function (resp) {
            console.log(resp.data[0][1])
            $scope.stocks = resp.data;

        });
    }
    $scope.load();

    $scope.add = function () {
        ngDialog.open({
            template: 'partials/add_stock.html',
            controller: 'AddStockCtrl',
            preCloseCallback: function () {
                $scope.load();
            }
        });
    }
});

as.controller('AddStockCtrl', function ($scope, WDService) {
    WDService.getProduct().then(function (resp) {
        $scope.products = resp.data;
        
    });
    $scope.save = function () {
        WDService.addStock($scope.stock).then(function (resp) {
            $scope.closeThisDialog('');
        });
    }
});
