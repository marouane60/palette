angular.module('nuBoard')
  .directive('nuButton', function () {
    return {
      restrict: 'E',
      templateUrl: 'app/button/button.tpl.html',
      controller: 'ButtonCtrl',
      replace: true
    }
  })
  .controller('ButtonCtrl', function ($scope, $location, RouterService) {

    if(localStorage.getItem('user')){
      $scope.buttonText = "Get more ink";
      $scope.draw = function () {
        $location.url('/payment');
      };
    }
    else{
      $scope.draw = function () {
        $location.url('/sign-in');
      };      
    }
  });
