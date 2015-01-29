var petitionVis = angular.module('petitionVis', ['ui.router', 'infinite-scroll', 'ui.bootstrap']);

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
			angular.copy(res.data, o.petitions);
			console.log(res.data);
		});
	};

	o.getSorted = function(sortBy, reverseOrder) {
		return $http.get('/petitions?sort=' + sortBy + "&reverse=" + reverseOrder.toString()).then(function(res){
		    angular.copy(res.data, o.petitions);
			console.log(res.data);
		});
	};

	o.getSortedLessThan = function(sortBy, reverseOrder, lessThan) {
		return $http.get('/petitions?sort=' + sortBy + '&reverse=' + reverseOrder.toString() + '&lessThan=' + lessThan).then(function(res){
		   	o.petitions.push(res.data);
		});
	};

	o.getSortedGreaterThan = function(sortBy, reverseOrder, greaterThan) {
		return $http.get('/petitions?sort=' + sortBy + '&reverse=' + reverseOrder.toString() + '&greaterThan=' + greaterThan).then(function(res){
		   	o.petitions.push(res.data);
		});
	};

	return o;
}]);

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

petitionVis.sortEnum = {
    TITLE : 0,
    SIGNATURES : 1,
    CREATED : 2,
}

petitionVis.controller('MainCtrl', [
	'$scope', 'petitions',
	function($scope, petitions){
		$scope.petitions = petitions.petitions;
		//$.material.ripples();

		$scope.loadMore = function() {
			//petitions.getNext();
		};

		$scope.sortEnum = {
		    TITLE : 0,
		    SIGNATURES : 1,
		    CREATED : 2,
		};

		$scope.sortBy = $scope.sortEnum.TITLE;
		$scope.reverse = false;

		$scope.setSortType = function(sortBy) {
			if (sortBy == 0) {
				$scope.sortBy = 'title';
			}
			else if (sortBy == 1) {
				$scope.sortBy = 'signatureCount';
			}
			else {
				$scope.sortBy = 'created';
			}
		};

		$scope.sort = function() {
			petitions.getSorted($scope.sortBy, $scope.reverse);
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
					return petitions.getSorted('signatureCount', false);
				}]
			}
		})
		$urlRouterProvider.otherwise('home');
	}]);

