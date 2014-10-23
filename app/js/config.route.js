(function () {
    'use strict';

    angular.module('myApp')
        .config(configFunc)
        .run(onRouteChangeError);

    configFunc.$inject = ['$routeProvider'];

    function configFunc($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/landing_page.html',
            controller: 'LandingPageController'
        });
        $routeProvider.when('/waitlist', {
            templateUrl: 'partials/waitlist.html',
            controller: 'WaitListController',
            controllerAs: 'vm'
        });
        $routeProvider.when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'AuthController',
            controllerAs: 'vm'
        });
        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'AuthController',
            controllerAs: 'vm'
        });
        $routeProvider.otherwise({redirectTo: '/'});
    };

    onRouteChangeError.$inject = ['$rootScope'];

    function onRouteChangeError($rootScope) {
        $rootScope.$on('$routeChangeError',
            function (event, current, previous, rejection) {
                console.log(event, current, previous, rejection);
            });
    };

}());
