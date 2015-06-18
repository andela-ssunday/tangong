'use strict';

angular.module('Tango')
  // .controller('editGigCtrl', ['$rootScope', '$scope', 'gigService', '$location', 'categoryService', '$stateParams', '$mdToast', '$animate', function($rootScope, $scope, gigService, $location, $stateParams, $mdToast, $animate, categoryService) {
  .controller('editGigCtrl', ['$rootScope', '$scope', 'gigService', '$location', '$stateParams', 'Upload', 'categoryService','$mdToast', '$animate', function($rootScope, $scope, gigService, $location, $stateParams, Upload, categoryService,$mdToast,$animate) {
        gigService.oneGig($stateParams.gigid).success(function(data) {
          $scope.gig = data;
          data.newCategory = data.category;
        });

          // .controller('editGigCtrl', ['$rootScope', '$scope', 'gigService', '$location','categoryService', function($rootScope, $scope, gigService, $location,categoryService){

          categoryService.getAll()
            .success(function(data) {
              $scope.categories = data;
            })

          // $scope.editGig = function(gigid) {
          //   gigService.oneGig(gigid).success(function(data) {
          //     $rootScope.gig = data;
          //     $rootScope.newCategory = data.category;
          //     $location.path('gig/edit/' + gigid);
          //   });
          // };

          $scope.checkCategory = function() {
            if ($scope.category._id === $rootScope.newCategory._id) {
              return "selected";
            }
          };

          $scope.saveChanges = function(gigid, gigData) {
            var localhost = "http://localhost:8000/api/gig";
            var heroku = "https://tangong-api.herokuapp.com/api/gig";
            var link = heroku;
            var gig = gigData;
            gig._id = gigid;
            console.log(2,gig);
            link += "/" + gigid;
            var upload = Upload.upload({
                url: link,
                method: "PUT",
                file: gig.image,
                fields: gig
              })
              .success(function(data) {
                $location.path("/gig/" + gigid);
                $mdToast.show({
                  templateUrl: 'app/views/editToast.html',
                  hideDelay: 6000,
                  position: $scope.getToastPosition()
                });
              });
          };

          $scope.toastPosition = {
            bottom: true,
            top: false,
            left: true,
            right: false
          };

          $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
              .filter(function(pos) {
                return $scope.toastPosition[pos];
              })
              .join(' ');
          };
        }]);
