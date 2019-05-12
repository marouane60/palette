'use strict';

angular.module('nuBoard')

  .directive('nuWatchSurface', function ($timeout, RouterService, UUID, ToolbarService, UserService) {
    return {
      link: function ($scope, $element) {

        var isDraw = false;
        var localShapeId;
        var isDrawEnabled;
        var user = JSON.parse(localStorage.getItem('user'));

        if(user && user.inkLvl>0)
          isDrawEnabled = true;
        else
          isDrawEnabled = false;

        var reportAction = function (action) {

          if (!action.id) {
            action.id = action.shapeId;
            delete action.shapeId;
          }

          RouterService.report({
            sourceId: 'surface-watcher',
            message: action
          })
        };

        var actionStart = function (eventData) {
          if (!eventData) {
            return;
          }
          isDraw = true;

          var actionData = {
            shapeId: UUID.generate(),
            sourceId: UserService.id(),
            points: positionToPoint(eventData)
          };

          assignDataWithToolbarProperties(actionData);
          localShapeId = actionData.shapeId;
          $scope.shapes[actionData.shapeId] = actionData;
          reportAction(actionData);
        };

        var positionToPoint = function (position) {
          return [position.layerX, position.layerY];

        };

        var assignDataWithToolbarProperties = function (data) {
          var toolbarProps = ToolbarService.getState();
          toolbarProps.type = toolbarProps.stylus;
          delete toolbarProps.stylus;

          for (var key in toolbarProps) {
            if (toolbarProps.hasOwnProperty(key)) {
              data[key] = toolbarProps[key];
            }
          }
        };

        var actionEnd = function () {
          isDraw = false;
          localShapeId = undefined;
        };

        var actionProceed = function (eventData) {
          var action = $scope.shapes[localShapeId];
          if (!action) {
            console.warn('no shape found to continue', localShapeId);
            return;
          }
          var point = positionToPoint(eventData);
          
          if(user.inkLvl>0){
            user.inkLvl = user.inkLvl - 1;
            action.points.push(point[0]);
            action.points.push(point[1]);

            var userNew = {
              id: user.id,
              email: user.email,
              inkLvl: user.inkLvl
            };
            var updates = {};

            updates['/users/' + user.id] = userNew;

            localStorage.setItem('user',JSON.stringify(user));
            document.getElementById('progress').value = user.inkLvl;

            firebase.database().ref().update(updates);
          }

          reportAction(action);
        };

        var eventHandlers = {};
        
        if(isDrawEnabled){
          eventHandlers = {
            'mousedown': function (data) {
              actionStart(data);
            },
            'mouseup': function (data) {
              actionEnd(data);
            },
            'mousemove': function (data) {
              if (isDraw) {
                actionProceed(data);
              }
            },
            'mouseout': function (data) {
              actionEnd(data);
            }
          };       
        }


        _.each(Object.keys(eventHandlers), function (eventName) {
          $element.on(eventName, eventHandlers[eventName])
        });

      },
      controller: function ($scope) {


      }
    }
  })

  .
  service('SurfaceWatcherService', function () {


  })
;
