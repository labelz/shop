/**
 * Created by arach on 7/20/2016.
 */
var as = angular.module('myApp.services', []);

as.service('WDService', ['$http', function ($http) {
    this.gettest = function (rfid) {
        var url = '/transaction/get';
        return $http.get(url, {
            params: {
                rfid: rfid
            }
        });
    };
    this.getProduct = function () {
        var url = '/product/get';
        return $http.get(url);
        // return list of item_id of that session
    };

    this.getTransaction = function () {
        var url = '/transaction/get';
        return $http.get(url);
        // return list of item_id of that session
    };

    this.getTransactionTodaySell = function () {
        var url = '/transaction/getTodaySell';
        return $http.get(url);
        // return list of item_id of that session
    };
    this.saveTransaction = function (productId, buyPrice, quantity, sellPrice) {
        var data = {
            productId: productId,
            buyPrice: buyPrice,
            quantity: quantity,
            sellPrice: sellPrice
        };
        var url = '/transaction/insert';
        return $http.put(url, data);
    };

    this.createTransaction = function (transaction) {

        var url = '/transactions';
        return $http.post(url, transaction);
    };

    this.editTransaction = function (transaction) {
        var url = '/transactions/';
        return $http.put(url+transaction.id, transaction);
    };

    this.deleteProduct = function(id){
        return $http.delete('/products/'+id);
    };

    this.deleteTransaction = function(id){
        return $http.delete('/transactions/'+id);
    };
}]);

as.factory('AuthService', function ($http, Session) {
    var authService = {};

    authService.login = function (credentials) {
        return $http
            .post('/user/login', credentials)
            .then(function (res) {
                Session.create(res.data.id, res.data.user.id,res.data.user.name,
                    res.data.user.role);
                return res.data.user;
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
        return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(Session.getAuthUser().userRole) !== -1);
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