angular.module('nuBoard')
  .directive('nuButton', function () {
    return {
      restrict: 'E',
      templateUrl: 'app/button/button.tpl.html',
      controller: 'ButtonCtrl',
      replace: true
    }
  })
  .controller('ButtonCtrl', function ($scope, RouterService) {

  });
