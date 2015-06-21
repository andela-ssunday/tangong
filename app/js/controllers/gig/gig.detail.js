'use strict';

angular.module('Tango')
  .controller('gigDetailCtrl', ['$scope', 'gigService', '$stateParams', function($scope, gigService, $stateParams) {

    gigService.oneGig($stateParams.gigid)
      .success(function(data) {
        $scope.gigInfo = data;
        document.getElementById('twitterLink').setAttribute("data-text", $scope.gigInfo.title);
      });
  }]);
