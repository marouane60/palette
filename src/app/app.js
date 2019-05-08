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

  // Get a reference to the database service
  var database = firebase.database();

      // FirebaseUI config.
      var uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            var user = authResult.user;
            var credential = authResult.credential;
            var isNewUser = authResult.additionalUserInfo.isNewUser;
            var providerId = authResult.additionalUserInfo.providerId;
            var operationType = authResult.operationType;

            console.log("user : "+user+"credential : "+credential+"isnewuser : "+isNewUser+"providerid : "+providerId
            +"operationtype : "+operationType);

            if(isNewUser){
                firebase.database().ref('users/' + authResult.user.uid).set({
                  id:authResult.user.uid,
                  email: authResult.user.email,
                  inkLvl:100
                });
              


            }
            // Do something with the returned AuthResult.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
          },
          signInFailure: function(error) {
            // Some unrecoverable error occurred during sign-in.
            // Return a promise when error handling is completed and FirebaseUI
            // will reset, clearing any UI. This commonly occurs for error code
            // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
            // occurs. Check below for more details on this.
            return handleUIError(error);
          }
        },
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
  
