'use strict';

angular.module('Tango')
	.controller('gigsCtrl', ['$scope', 'gigService','categoryService','$window', function($scope, gigService, categoryService,$window){
	  gigService.allGigs().success(function(data){
	    $scope.gigs = data;
	  });
		categoryService.getAll()
			.success(function(data){
				$scope.categories = data;
			})
		$scope.doAdd = function(gig){
			console.log(gig);
			var id = $window.localStorage.getItem('token');
			console.log(id);
			gigService.addGig(gig,id)
				.success(function(data){
					console.log(1,data);
				})
				.error(function(err){
					console.log(2,err);
				})
		}
}]);