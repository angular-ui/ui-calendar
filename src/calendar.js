/*
*  AngularJs Fullcalendar Wrapper for the JQuery FullCalendar
*  API @ http://arshaw.com/fullcalendar/
*
*  Angular Calendar Directive that takes in the [eventSources] nested array object as the ng-model and watches it deeply changes.
*       Can also take in multiple event urls as a source object(s) and feed the events per view.
*       The calendar will watch any eventSource array and update itself when a change is made.
*
*/

angular.module('ui.calendar', [])
  .constant('uiCalendarConfig', {})
  .directive('uiCalendar', ['uiCalendarConfig', '$parse', function(uiCalendarConfig) {
  uiCalendarConfig = uiCalendarConfig || {};
  var sourceSerialId = 1, eventSerialId = 1;
  //returns calendar
  return {
    require: 'ngModel',
    scope: {ngModel:'=',config:'='},
    restrict: 'A',
    link: function(scope, elm, attrs) {
      var sources = scope.ngModel;
      scope.destroy = function(){
        if(attrs.calendar){
          scope.calendar = scope.$parent[attrs.calendar] =  elm.html('');
        }else{
          scope.calendar = elm.html('');
        }
      };
      scope.destroy();
      scope.init = function(){
        var options = { eventSources: sources };
        angular.extend(options, uiCalendarConfig, attrs.uiCalendar ? scope.$parent.$eval(attrs.uiCalendar) : {});
        scope.calendar.fullCalendar(options);
      };
      scope.init();

      // Track changes in array by assigning id tokens to each element and watching the scope for changes in those tokens
      // arguments:
      //  arraySource array of function that returns array of objects to watch
      //  tokenFn function(object) that returns the token for a given object
      var changeWatcher = function(arraySource, tokenFn) {
        var self;
        var getTokens = function() {
          var array = angular.isFunction(arraySource) ? arraySource() : arraySource;
          return array.map(function(el) {
            var token = tokenFn(el);
            map[token] = el;
            return token;
          });
        };
        // returns elements in that are in a but not in b
        // subtractAsSets([4, 5, 6], [4, 5, 7]) => [6]
        var subtractAsSets = function(a, b) {
          var result = [], inB = {}, i, n;
          for (i = 0, n = b.length; i < n; i++) {
            inB[b[i]] = true;
          }
          for (i = 0, n = a.length; i < n; i++) {
            if (!inB[a[i]]) {
              result.push(a[i]);
            }
          }
          return result;
        };

        // Map objects to tokens and vice-versa
        var map = {};

        var applyChanges = function(newTokens, oldTokens) {
          var i, n, el, token;
          var replacedTokens = {};
          var removedTokens = subtractAsSets(oldTokens, newTokens);
          for (i = 0, n = removedTokens.length; i < n; i++) {
            var removedToken = removedTokens[i];
            el = map[removedToken];
            delete map[removedToken];
            var newToken = tokenFn(el);
            // if the element wasn't removed but simply got a new token, its old token will be different from the current one
            if (newToken === removedToken) {
              self.onRemoved(el);
            } else {
              replacedTokens[newToken] = removedToken;
              self.onChanged(el);
            }
          }
          var addedTokens = subtractAsSets(newTokens, oldTokens);
          for (i = 0, n = addedTokens.length; i < n; i++) {
            token = addedTokens[i];
            el = map[token];
            if (!replacedTokens[token]) {
              self.onAdded(el);
            }
          }
        };
        return self = {
          subscribe: function(scope) {
            scope.$watch(getTokens, applyChanges, true);
          },
          onAdded: angular.noop,
          onChanged: angular.noop,
          onRemoved: angular.noop
        };
      };

      //= tracking sources added/removed

      var eventSourcesWatcher = changeWatcher(sources, function(source) {
        return source.__id || (source.__id = sourceSerialId++);
      });
      eventSourcesWatcher.subscribe(scope);
      eventSourcesWatcher.onAdded = function(source) {
        scope.calendar.fullCalendar('addEventSource', source);
      };
      eventSourcesWatcher.onRemoved = function(source) {
        scope.calendar.fullCalendar('removeEventSource', source);
      };

      //= tracking individual events added/changed/removed
      var allEvents = function() {
        // return sources.flatten(); but we don't have flatten
        var arraySources = [];
        for (var i = 0, srcLen = sources.length; i < srcLen; i++) {
          var source = sources[i];
          if (angular.isArray(source)) {
            arraySources.push(source);
          }
        }
        return Array.prototype.concat.apply([], arraySources);
      };
      var eventsWatcher = changeWatcher(allEvents, function(e) {
        if (!e.__uiCalId) {
          e.__uiCalId = eventSerialId++;
        }
        // This extracts all the information we need from the event. http://jsperf.com/angular-calendar-events-fingerprint/3
        return "" + e.__uiCalId + (e.id || '') + (e.title || '') + (e.url || '') + (+e.start || '') + (+e.end || '') +
            (e.allDay || false) + (e.className || '');
      });
      eventsWatcher.subscribe(scope);
      eventsWatcher.onAdded = function(event) {
        scope.calendar.fullCalendar('renderEvent', event);
      };
      eventsWatcher.onRemoved = function(event) {
        scope.calendar.fullCalendar('removeEvents', function(e) { return e === event; });
      };
      eventsWatcher.onChanged = function(event) {
        scope.calendar.fullCalendar('updateEvent', event);
      };
    }
  };
}]);
