'use strict';

/* Directives */

angular.module('myApp.directives', [])
.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
.directive('partyitem', function() {
	return {
		restrict: 'E',
		templaterUrl: '/partials/parties.html',
		scope: {
			party: '@p',
			removeParty: '&',
			sendTextMessage: '&',
			updateParty: '&'
		}
	}
})
.directive('partyName', function() {
	return {
		restrict: 'E',
		template: 
			[
					"<div>",
	                   "	<strong>{{party.name}} ({{party.size}} people)</strong>",
	                "</div>",
	                 "<div>",
	                   "	{{party.phone}}",
	                "</div>"
			].join(""),
		scope: {
			party: '='
		}
	}
})
.directive('partyButtons', function() {
	return {
		restrict: 'E',
		template: 
			['<div>',
                '<button ng-click="send()" type="submit" class="btn btn-success">Send SMS</button>',
                '<button ng-click="remove()" type="submit" class="btn btn-danger">Remove</button>',
              '</div>'
			].join(""),
		scope: {
			party: '=',
			send: '&',
			remove: '&'
		}
	}
})
.directive('partyall', function() {
	return {
	//	transclude: true,
		replace:true,
		restrict: 'E',
		scope: {
			party: '=',
			send: '&',
			remove: '&',
			update: '&'
		},
		controller: function($scope) {
			$scope.myparty = $scope.party; 
		},
		templateUrl: 'partials/parties.html'
	}
});