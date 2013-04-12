/**
 * calendarDemoApp - 0.1.0
 */
angular.module('calendarDemoApp', ['ui.calendar']);

function CalendarCtrl($scope) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    /* event source that pulls from google.com */
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };
    /* event source that contains custom events on the scope */
    $scope.events = [
      {title: 'All Day Event',start: new Date(y, m, 1)},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
      {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };
    /* alert on eventClick */
    $scope.alertEventOnClick = function( date, allDay, jsEvent, view ){
        $scope.$apply(function(){
          $scope.alertMessage = ('Day Clicked ' + date);
        });
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
        $scope.$apply(function(){
          $scope.alertMessage = ('Event Droped to make dayDelta ' + dayDelta);
        });
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
        $scope.$apply(function(){
          $scope.alertMessage = ('Event Resized to make dayDelta ' + minuteDelta);
        });
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view) {
      $scope.myCalendar.fullCalendar('changeView',view);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
}
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
    scope: {ngModel:'=',config:'='},
    restrict: 'A',
    controller:function($scope,$element){
    },
    link: function(scope, elm, attrs,calCtrl) {
      var sources = scope.ngModel;
      scope.destroy = function(){
        if(attrs.calendar){
          scope.calendar = scope.$parent[attrs.calendar] =  elm.html('');
        }else{
          scope.calendar = elm.html('');
        }
      };
      scope.destroy();

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
      scope.init = function(){
        var options = { eventSources: sources };
        angular.extend(options, uiCalendarConfig, attrs.uiCalendar ? scope.$parent.$eval(attrs.uiCalendar) : {});
        scope.calendar.fullCalendar(options);
      };
      scope.init();
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
        scope.calendar.fullCalendar('addEventSource',source);
      };
      sourcesTracker.onRemoved = function(source) {
        scope.calendar.fullCalendar('removeEventSource',source);
      };
      scope.$watch(eventsFingerprint, function() {
        scope.calendar.fullCalendar('refetchEvents');
      });
    }
  };
}]);
/* EOF */
