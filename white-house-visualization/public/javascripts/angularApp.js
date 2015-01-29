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

	o.getSorted = function(sortBy, reverseOrder, limit) {
		return $http.get('/petitions?sort=' + sortBy + "&reverse=" + reverseOrder.toString() + "&limit=" + limit).then(function(res){
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

		$scope.sortEnum = {
		    TITLE : 0,
		    SIGNATURES : 1,
		    CREATED : 2,
		};


		$scope.radioModel = 'Ascending';
		$scope.sortBy = 'title';
		$scope.sortLabel = 'Title';
		$scope.limit = 20;

		$scope.setSortType = function(sortBy) {
			if (sortBy == 0) {
				$scope.sortBy = 'title';
				$scope.sortLabel = 'Title';
			}
			else if (sortBy == 1) {
				$scope.sortBy = 'signatureCount';
				$scope.sortLabel = 'Signature Count';
			}
			else {
				$scope.sortBy = 'created';
				$scope.sortLabel = 'Date Created';
			}
		};

		$scope.setLimit = function(limit) {
			$scope.limit = limit;
		};


		$scope.sort = function() {
			if ($scope.radioModel == 'Ascending') {
				petitions.getSorted($scope.sortBy, false, $scope.limit);
			}
			else {
				petitions.getSorted($scope.sortBy, true, $scope.limit);
			}
		};

		$scope.loadMore = function() {};
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
					return petitions.getSorted('title', false, 20);
				}]
			}
		})
		$urlRouterProvider.otherwise('home');
	}]);

