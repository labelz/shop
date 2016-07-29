/**
 * Created by arach on 7/20/2016.
 */
var as = angular.module('myApp.services', []);

as.service('WDService', ['$http', function ($http) {

    this.updateStock = function () {
        var url = '/shop/stock/updateStock';
        return $http.get(url);
        // return list of item_id of that session
    };
    this.getLatestStock = function () {
        var url = '/shop/stock/getLatest';
        return $http.get(url);
        // return list of item_id of that session
    };

    this.addStock = function (stock) {
        var url = '/shop/stock/addStock';
        return $http.post(url, stock);
        // return list of item_id of that session
    };

    this.getProduct = function () {
        var url = '/shop/product/get';
        return $http.get(url);
        // return list of item_id of that session
    };

    this.getTransaction = function () {
        var url = '/shop/transaction/get';
        return $http.get(url);
        // return list of item_id of that session
    };

    this.getTransactionTodaySell = function () {
        var url = '/shop/transaction/getTodaySell';
        return $http.get(url);
        // return list of item_id of that session
    };

    this.createTransaction = function (transaction) {
        var url = '/shop/transactions';
        return $http.post(url, transaction);
    };

    this.editTransaction = function (transaction) {
        var url = '/shop/transactions/';
        return $http.put(url+transaction.id, transaction);
    };

    this.deleteTransaction = function(id){
        return $http.delete('/shop/transactions/'+id);
    };

    this.createProduct = function (product) {
        var url = '/shop/products';
        return $http.post(url, product);
    };

    this.editProduct = function (product) {
        var url = '/shop/products/';
        return $http.put(url+product.id, product);
    };

    this.deleteProduct = function(id){
        return $http.delete('/shop/products/'+id);
    };
    this.getExpenseToday = function () {
        var url = '/shop/expense/getToday';
        return $http.get(url);
        // return list of item_id of that session
    };
    this.createExpense = function (expense) {
        var url = '/shop/expenses';
        return $http.post(url, expense);
    };

    this.editExpense = function (expense) {
        var url = '/shop/expenses/';
        return $http.put(url+expense.id, expense);
    };

    this.deleteExpense = function(id){
        return $http.delete('/shop/expenses/'+id);
    };

}]);

as.factory('AuthService', function ($http, Session) {
    var authService = {};

    authService.login = function (credentials) {
        return $http
            .post('/shop/api/login', credentials)
            .then(function (res) {
                console.log(res.data.roles);
                for (var i = 0; i < res.data.roles.length; i++) {
                    console.log(res.data.roles[i]);

                }
                Session.create(res.data.access_token, res.data.refresh_token,res.data.username,
                    res.data.roles);
                return res.data.username;
            });
    };
    authService.logout = function(){
        Session.destroy();
    };

    authService.isAuthenticated = function () {
        // console.log(Session.getAuthUser().id);
        return !!Session.getAuthUser().id;
    };

    authService.getUser = function(){
        return Session.getAuthUser().userName;
    }

    authService.isAuthorized = function (authorizedRoles) {
       
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        // console.log(authorizedRoles);
        if(authService.isAuthenticated()) {
            if (authorizedRoles.indexOf('*') == -1) {
                var userRole = Session.getAuthUser().userRole.split(',');
                for (var i = 0; i < userRole.length; i++) {

                    if (authorizedRoles.indexOf(userRole[i]) !== -1) {
                        return true;
                    }
                }
            } else {
                return true;
            }
        }else{
            return false;
        }
        return false;

        // return (authService.isAuthenticated() && checkAuthorized);
    };

    return authService;
});

as.service('Session', function ($window) {
    this.getAuthUser = function () {
        return {
            id: $window.localStorage.getItem('sessionId'),
            userId: $window.localStorage.getItem('userId'),
            userName: $window.localStorage.getItem('userName'),
            userRole: $window.localStorage.getItem('userRole')

        }
    };

    this.create = function (sessionId, userId ,userName, userRole) {
        $window.localStorage.setItem('sessionId', sessionId);
        $window.localStorage.setItem('userId', userId);
        $window.localStorage.setItem('userName', userName);
        $window.localStorage.setItem('userRole', userRole);
        // console.log($window.localStorage.getItem('userId'));
    };
    this.destroy = function () {
        $window.localStorage.removeItem('sessionId');
        $window.localStorage.removeItem('userId');
        $window.localStorage.removeItem('userName');
        $window.localStorage.removeItem('userRole');
        // this.id = null;
        // this.userId = null;
        // this.userRole = null;
    };
});

as.config(function ($httpProvider) {
    $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
            return $injector.get('AuthInterceptor');
        }
    ]);
});
as.factory('AuthInterceptor', function ($rootScope, $q,
                                        AUTH_EVENTS) {
    return {
        responseError: function (response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized,
                419: AUTH_EVENTS.sessionTimeout,
                440: AUTH_EVENTS.sessionTimeout
            }[response.status], response);
            return $q.reject(response);
        }
    };
});