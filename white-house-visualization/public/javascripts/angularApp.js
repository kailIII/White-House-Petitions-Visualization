var petitionVis = angular.module('petitionVis', ['ui.router', 'infinite-scroll']);

petitionVis.factory('petitions', ['$http', function($http){
	var o = {
		petitions: []
	};

	o.getAll = function() {
		return $http.get('/petitions').then(function(res){
			angular.copy(res.data, o.petitions);
			console.log(res.data);
		});
	};

	o.get = function(id) {
		return $http.get('/petitions/' + id).then(function(res){
		    return res.data;
		});
	};

	o.getSorted = function(sortBy, reverseOrder) {
		return $http.get('/petitions?sort=' + sortBy + "&reverseOrder=" + reverseOrder).then(function(res){
		    return res.data;
		});
	};

	o.getSortedLessThan = function(sortBy, reverseOrder, lessThan) {
		return $http.get('/petitions?sort=' + sortBy + '&reverseOrder=' + reverseOrder + & 'lessThan=' + lessThan).then(function(res){
		    return res.data;
		)};
	};

	o.getSortedGreaterThan = function(sortBy, reverseOrder, greaterThan) {
		return $http.get('/petitions?sort=' + sortBy + '&reverseOrder=' + reverseOrder + & 'greaterThan=' + greaterThan).then(function(res){
		    return res.data;
		)};
	};

	return o;
}]);

//|orderBy:'signatureProgress':'reverse'

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
				//	angular.element(element).addClass('blue');
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
		//$.material.ripples();

		$scope.sort = function() {
			console.log("Sort");
		};

		var loadMore = function() {
			petitions.getNext();
		}
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

