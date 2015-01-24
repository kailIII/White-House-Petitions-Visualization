var petitionVis = angular.module('petitionVis', ['ui.router']);


petitionVis.factory('petitions', ['$http', function($http){
	var o = {
		petitions: []
	};

	o.get = function() {
		var responsePromise = $http.get("https://api.whitehouse.gov/v1/petitions.json?limit=3&offset=0&createdBefore=1352924535");

		responsePromise.success(function(data, status, headers, config) {
			return [{name: "Petition 1"}, {name: "Petition 2"}];
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("AJAX failed!");
		});
	}

	return o;
}]);

petitionVis.controller('MainCtrl', [
	'$scope', 'petitions',
	function($scope, petitions){
		$scope.test = 'Hello world!';
		$scope.petitions = petitions.get();
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
		})
		$urlRouterProvider.otherwise('home');
	}]);

