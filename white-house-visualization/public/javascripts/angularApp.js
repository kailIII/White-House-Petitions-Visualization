var petitionVis = angular.module('petitionVis', ['ui.router', 'infinite-scroll', 'ui.bootstrap']);

var startTime = new Date().getTime();

petitionVis.factory('petitions', ['$http', function($http){
	var o = {
		petitions: [],
		visiblePetitions: []
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
		    if (res == null || res.data == null) {
		    	toastr.success('Error Loading Data');
		    }
		    console.log(res.data);
			var completeTime = new Date().getTime();
			var elapsedTime = (completeTime - startTime) / 1000;
			toastr.success('Data Returned in ' + elapsedTime + "s");
		    angular.copy(res.data, o.petitions);
		   	angular.copy(res.data.slice(0,5), o.visiblePetitions);
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
		$scope.visiblePetitions = petitions.visiblePetitions;
		//$.material.ripples();

		$scope.sortEnum = {
		    TITLE : 0,
		    SIGNATURES : 1,
		    CREATED : 2,
		};

		$scope.radioModel = 'Ascending';
		$scope.sortBy = 'title';
		$scope.sortLabel = 'Title';

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

/*
		$scope.limit = 20;
		$scope.setLimit = function(limit) {
			$scope.limit = limit;
		};
		*/


		$scope.sort = function() {
			if ($scope.radioModel == 'Ascending') {
				petitions.getSorted($scope.sortBy, false, $scope.limit);
			}
			else {
				petitions.getSorted($scope.sortBy, true, $scope.limit);
			}
			startTime = new Date().getTime();
			toastr.info('Loading From Database...')
		};

		var listMax = 5;
		$scope.loadMore = function() {
			listMax++
      		$scope.visiblePetitions.push($scope.petitions[listMax]);
		};
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
			data: {
            	css: 'styles/style.css'
          	},
			resolve: {
				petitionPromise: ['petitions', function(petitions){
					return petitions.getSorted('title', false, 2000);
				}]
			}
		})
		$urlRouterProvider.otherwise('home');
	}]);

