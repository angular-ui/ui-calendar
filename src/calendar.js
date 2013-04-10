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
  //returns calendar
  return {
    require: 'ngModel',
    scope: true,
    restrict: 'A',
    link: function(scope, elm, attrs, parent) {
      var sources = scope.$eval(attrs.ngModel);
      var calendar;
      if(!attrs.calendar){
        calendar = elm.html(''); 
      }
      else{
        calendar = angular.element(elm.parent()).scope()[attrs.calendar] = elm.html('');
      }
      var eventsFingerprint = function() {
        var fpn = "";
        angular.forEach(sources, function(events) {
          if (angular.isArray(events)) {
            for (var i = 0, n = events.length; i < n; i++) {
              var e = events[i];
              // This extracts all the information we need from the event. http://jsperf.com/angular-calendar-events-fingerprint/3
              fpn = fpn + (e.id || '') + (e.title || '') + (e.url || '') + (+e.start || '') + (+e.end || '') +
                (e.allDay || false) + (e.className || '');
            }
          } else {
            fpn = fpn + (events.url || '');
          }
        });
        return fpn;
      };

      var options = { eventSources: sources };
      angular.extend(options, uiCalendarConfig, attrs.uiCalendar ? scope.$eval(attrs.uiCalendar) : {});
      calendar.fullCalendar(options);

      // Track changes in array by assigning numeric ids to each element and watching the scope for changes in those ids
      var changeTracker = function(array) {
        var self;
        // Map objects to unique numeric IDs and vice-versa. To avoid memory leaks call forget on discarded objects
        var idMap = {}, nextId = 1;
        var idStore = {
          toId: function(element) {
            return element.__id || (element.__id = nextId++);
          },
          fromId: function(id) {
            return idMap[id];
          },
          remember: function(element) {
            idMap[this.toId(element)] = element;
          },
          forget: function(element) {
            delete idMap[element.__id];
          }
        };

        var elementIds = function() {
          return array.map(function(el) {
            idStore.remember(el);
            return idStore.toId(el);
          });
        };
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
        var applyChanges = function(newIds, oldIds) {
          var i, n, el;
          var addedIds = subtractAsSets(newIds, oldIds);
          for (i = 0, n = addedIds.length; i < n; i++) {
            self.onAdded(idStore.fromId(addedIds[i]));
          }
          var removedIds = subtractAsSets(oldIds, newIds);
          for (i = 0, n = removedIds.length; i < n; i++) {
            el = idStore.fromId(removedIds[i]);
            idStore.forget(el);
            self.onRemoved(el);
          }
        };
        return self = {
          subscribe: function(scope) {
            scope.$watch(elementIds, applyChanges, true);
          }
        };
      };

      var sourcesTracker = changeTracker(sources);
      sourcesTracker.subscribe(scope);
      sourcesTracker.onAdded = function(source) {
        calendar.fullCalendar('addEventSource', source);
      };
      sourcesTracker.onRemoved = function(source) {
        calendar.fullCalendar('removeEventSource', source);
      };
      scope.$watch(eventsFingerprint, function() {
        calendar.fullCalendar('refetchEvents');
      });
    }
  };
}]);