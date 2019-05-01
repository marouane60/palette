'use strict';

angular.module('nuBoard', ['firebase', 'ngRoute'])

  .constant('AppConfig', {
    defaultToolset: {
      stylus: {id: 'line', value: 'line'},
      color: {id: 'skyblue', value: 'skyblue'},
      width: {id: '5', value: 5},
      lineCap: {id: 'round', value: 'round'},
      lineJoin: {id: 'round', value: 'round'},
      followAction: {active: true}
    },
    firebase: {
      baseUrl: 'https://palette-ef61a.firebaseio.com',
      appNamespace: 'palette-ef61a',
      upstreamMinIntervalMilliseconds: 200
    },
    syncActive: true
  })

  .run(['Logger', function (Logger) {
    // init Logger
    Logger.setLevel(Logger.LOG);
  }])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/board', {
        controller: 'MainCtrl',
        templateUrl: 'app/app.tpl.html'
      })
      .when('/sign-in', {
        templateUrl: 'app/sign-in/sign-in.tpl.html'
      })
      .otherwise({
        redirectTo: '/board'
      })
  })

  .controller('MainCtrl', function ($scope, $routeParams, $rootScope, SyncService, AppConfig, SurfaceService, UserService) {

    if (AppConfig.syncActive) {
      SyncService.init();
    }
    SurfaceService.init();
    $rootScope.boardId = $routeParams.boardId;
    $rootScope.userId = UserService.id();
    $scope.shapes = {}; //todo: move this to surface
    $scope.focus = {x: 0.5, y: 0.5};
    $scope.surfaceWidth = 2000;
    $scope.surfaceHeight = 2000;
    $scope.minimapWidth = 200;
    $scope.minimapHeight = 200;
    $scope.minimapZoomScale = 0.1;
    $scope.surfacePositionOffset = {};
  })

  
