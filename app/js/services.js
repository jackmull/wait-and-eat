(function () {

    'use strict';

    var services = angular.module('myApp.services', []);

    services.value('fbURL', 'https://waitandeat-jack.firebaseio.com');
    services.factory('dataService', dataService);

    dataService.$inject = ['fbURL', '$firebase', '$firebaseSimpleLogin'];

    function dataService(fbURL, $firebase, $firebaseSimpleLogin) {

        var dataRef = new Firebase(fbURL);

        var service = {
            dataRef: dataRef,
            getAuth: getAuth,
            getChild: getChild
        };

        return service;
//--					
        function getChild(child) {
            var url = fbURL + '/' + child;
            return $firebase(new Firebase(url));
        }

        function getAuth() {
            return $firebaseSimpleLogin(new Firebase(fbURL));
        }

    }

    services.factory('authService', authService);
    authService.$inject = ['$rootScope', '$location', 'dataService'];

    function authService($rootScope, $location, dataService) {

        var auth = dataService.getAuth();
        var emails = dataService.getChild('emails');

        var authService = {
            getCurrentUser: getCurrentUser,
            login: login,
            logout: logout,
            register: register
        };

        activate();

        return authService;

//------
        function activate() {

            $rootScope.$on("$firebaseSimpleLogin:login",
                function (e, user) {
                    $rootScope.currentUser = user;
                    $rootScope.$broadcast("login");
                    console.log("logged in...");
                }
            );

            $rootScope.$on("$firebaseSimpleLogin:logout", function () {
                $rootScope.currentUser = null;
            });
        }

        function logout() {
            auth.$logout();
            $location.path('/');
        }

        function login(user, callback) {
            auth.$login('password', user)
                .then(
                function (data) {
                    console.log(data);
                    callback(null, data);
                    $location.path('/waitlist');
                },
                function (err) {
                    console.log(err);
                    callback(err, null);
                    return;
                }
            );
        }

        function register(user) {
            auth.$createUser(user.email, user.password)
                .then(function (data) {
                    console.log(data);
                    login(user, function (err, data) {
                        if (!err) {
                            emails.$push({email: user.email});
                        }
                    });
                },
                function (err) {
                    console.log(err);
                    callback(err, null);
                    return;
                });
        }

        function getCurrentUser() {
            return auth.$getCurrentUser();
        }

    }

    services.factory('partyService', partyService);
    partyService.$inject = ['$firebase', 'dataService', 'fbURL'];

    function partyService($firebase, dataService, fbURL) {

        return {
            add: add,
            getPartiesByUserId: getPartiesByUserId,
            remove: remove,
            update: update
        };

        function getPartiesByUserId(userId) {
            var partyUrl = fbURL + '/users/' + userId + '/parties';
            return $firebase(new Firebase(partyUrl));
        }

        function add(newParty, userId) {
            var parties = getPartiesByUserId(userId);
            parties.$push(newParty);
        }

        function update(party, userId) {
            var partyRef = getPartiesByUserId(userId);
            var obj = {
                name: party.name,
                phone: party.phone,
                size: party.size,
                done: party.done,
                notified: party.notified};
            partyRef.$update(party.$id, obj);
        }

        function remove(party, userId) {
            if (party) {
                var parties = getPartiesByUserId(userId);
                parties.$remove(party.$id, party);
            }
        }

    }

    services.factory('textMessageService', textMessageService);

    textMessageService.$inject = ['partyService', 'dataService', 'dateFilter'];

    function textMessageService(partyService, dataService, dateFilter) {

        return {
            sendMessage: sendMessage
        };

        function sendMessage(party, userId) {

            var textMessages = dataService.getChild('textMessages');

            var newTextMessage = {
                name: party.name,
                phone: party.phone,
                size: party.size
            };

            textMessages.$push(newTextMessage);
            party.notified = dateFilter(new Date(), "M/d h:mm");
            partyService.update(party, userId);
        }
    }

}());
