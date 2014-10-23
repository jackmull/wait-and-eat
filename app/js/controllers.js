(function () {
    'use strict';

    /* Controllers */

    var controllers = angular.module('myApp.controllers', []);
    controllers.controller('LandingPageController', [function () {
    }]);

    controllers.controller('WaitListController', WaitListController);
    WaitListController.$inject = ['$scope', 'partyService', 'textMessageService', 'authService'];
    function WaitListController($scope, partyService, textMessageService, authService) {

        var vm = this;

        var EmptyParty = function () {
            return {name: "", phone: "", size: "", done: false, notified: 'No'};
        }

        vm.newParty = EmptyParty();
        vm.isInit = false;
        vm.parties = null;

        if ($scope.currentUser && $scope.currentUser.id) {
            vm.parties = partyService.getPartiesByUserId($scope.currentUser.id).$asArray();
            vm.isInit = true;
        }
        else { // gets in this situation on page refresh, prob a better solution
            vm.isInit = false;
        }

        $scope.$on("login", function () {
            vm.parties = partyService.getPartiesByUserId($scope.currentUser.id).$asArray();
            vm.isInit = true;
        });

        vm.hasError = function (input) {
            return input + ".$invalid && !" + input + ".$pristine";
        };

        vm.addParty = function () {
            partyService.add(vm.newParty, $scope.currentUser.id);
            vm.newParty = EmptyParty();
            $scope.partyForm.$setPristine();
        };

        vm.updateParty = function (party) {
            partyService.update(party, $scope.currentUser.id);
        };

        vm.removeParty = function (party) {
            partyService.remove(party, $scope.currentUser.id);
        };

        vm.sendTextMessage = function (party) {
            textMessageService.sendMessage(party, $scope.currentUser.id);
        };
    };

    controllers.controller('AuthController', AuthController);
    AuthController.$inject = ['authService', '$scope', '$location'];

    function AuthController(authService, $scope, $location) {
        var vm = this;

        vm.user = {email: "", password: ""};
        vm.errmsg = "";

        vm.register = function () {
            authService.register(vm.user);
        };

        vm.login = function () {
            vm.errmsg = "";
            authService.login(vm.user, function (err, user) {
                if (err) {
                    vm.errmsg = "Specified email or password does not exist.";
                }
                else {
                    vm.errmsg = "";
                }
            });
        };

        vm.logout = function () {
            authService.logout();
        };
    };

})();



















