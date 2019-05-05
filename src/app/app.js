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
        controller: 'SignCtrl',
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

  .controller('SignCtrl', function ($scope, $routeParams, $rootScope, SyncService, AppConfig) {
    
      // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBUDgl99tdUHmvUuISj4van0SCuUA_cX6g",
    authDomain: "palette-ef61a.firebaseapp.com",
    databaseURL: "https://palette-ef61a.firebaseio.com",
    projectId: "palette-ef61a",
    storageBucket: "palette-ef61a.appspot.com",
    messagingSenderId: "831285475315",
    appId: "1:831285475315:web:956b2a6f103134ea"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

      // FirebaseUI config.
      var uiConfig = {
        signInSuccessUrl: '<url-to-redirect-to-on-success>',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
          window.location.assign('<your-privacy-policy-url>');
        }
      };

      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);
  })
  
