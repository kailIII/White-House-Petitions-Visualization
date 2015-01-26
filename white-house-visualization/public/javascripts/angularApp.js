var petitionVis = angular.module('petitionVis', ['ui.router']);

petitionVis.factory('petitions', ['$http', function($http){
	var o = {
		petitions: []
	};

	o.getAll = function() {
		return $http.get('/petitions').then(function(res){
			angular.copy(res.data, o.petitions);
			console.log(res.data);
		});
	}

	return o;
}]);

petitionVis.filter('orderObjectBy', function() {
	return function(items, field, reverse) {
		var filtered = [];
		angular.forEach(items, function(item) {
			filtered.push(item);
		});
		filtered.sort(function (a, b) {
			return (a[field] > b[field] ? 1 : -1);
		});
		if(reverse) filtered.reverse();
		return filtered;
	};
});

petitionVis.directive('header', function() {
	return {
		compile: function compile( tElement, tAttributes) {
			return {
				pre: function preLink(scope, element, attributes) {
					element.addClass('animated bounceInLeft')
				},
				post: function postLink( scope, element, attributes ) {
				}
			};
		}
	}
});


petitionVis.directive('panelheader', function() {
	return {
		compile: function compile( tElement, tAttributes) {
			return {
				pre: function preLink(scope, element, attributes, $index) {
				if (scope.$index == 1) {
					angular.element(element).addClass('blue');
				}
				},
				post: function postLink( scope, element, attributes ) {
				}
			};
		}
	}
});

petitionVis.controller('MainCtrl', [
	'$scope', 'petitions',
	function($scope, petitions){
		$scope.petitions = petitions.petitions;
		$.material.ripples()
	}
	]).config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			resolve: {
				petitionPromise: ['petitions', function(petitions){
					return petitions.getAll();
				}]
			}
		})
		$urlRouterProvider.otherwise('home');
	}]);

