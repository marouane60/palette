'use strict';

angular.module('nuBoard')
  .controller('ToolbarController', function ($scope, ToolbarService, $location) {

    $scope.selected = {};
    $scope.inkLvl = 0;

    var user = JSON.parse(localStorage.getItem('user'));

    if(user){
      $scope.inkLvl = user.inkLvl;
    }

    $scope.menu = {
      tools: [
        {
          id: 'followAction',
          active: true
        },
        {
          id: 'stylus',
          options: [
            {id: 'line', logoId: 'pencil'}
          ]
        },
        {
          id: 'color',
          options: [
            {id: 'green', logoId: 'circle', value: 'green'},
            {id: 'skyblue', logoId: 'circle', value: 'skyblue'},
            {id: 'red', logoId: 'circle', value: 'red'},
            {id: 'yellow', logoId: 'circle', value: 'yellow'},
            {id: 'white', logoId: 'circle', value: 'white'}
          ]
        },
        {
          id: 'width',
          options: [
            {id: '20', value: 20},
            {id: '10', value: 10},
            {id: '5', value: 5},
            {id: '2', value: 2},
            {id: '1', value: 1}
          ]
        }
      ]
    };

    $scope.$watch('menu', function () {
        ToolbarService.updateState(angular.copy($scope.menu));
        $scope.selected = ToolbarService.getState();
      }, true
    );
    $scope.pickTool = function (tool, option) {
      angular.forEach(tool.options, function (anyOption) {
        delete anyOption.selected
      });
      option.selected = true;
      window.localStorage.setItem('inkWidth', option.value);
    };

    $scope.toggleTool = function (tool) {
      tool.active = !tool.active;
    };

    $scope.signIn = function () {
      $location.url('/sign-in');
    };

    $scope.payment = function () {
      $location.url('/payment');
    };
  })

  .directive('nuToolbar', function () {

    return {
      restrict: 'E',
      templateUrl: 'app/toolbar/toolbar.tpl.html',
      controller: 'ToolbarController',
      replace: true
    }

  });
