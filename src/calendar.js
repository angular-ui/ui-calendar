/*
*  AngularJs Fullcalendar Wrapper for the JQuery FullCalendar
*  API @ http://arshaw.com/fullcalendar/
*
*  Angular Calendar Directive that takes in the [eventSources] nested array object as the ng-model and watches eventSources deep for changes.
*       Can also take in multiple event urls as a source object(s) and feed the events per view.
*       The calendar will watch all eventSources and update itself automatically when the underlying data is modified.
*
*/

angular.module('ui.calendar', [])

.constant('uiCalendarConfig', {})

.directive('uiCalendar',['uiCalendarConfig', '$parse', function (uiCalendarConfig) {
     uiCalendarConfig = uiCalendarConfig || {};
     //returns calendar
     return {
        require: 'ngModel',
        restrict: 'A',
          link: function(scope, elm, attrs) {
            var sources = scope.$eval(attrs.ngModel);

            var eventsFingerprint = function () {
              var fpn = "";
              angular.forEach(sources, function (events) {
                if (angular.isArray(events)) {
                  for (var i = 0, n = events.length; i < n; i++) {
                    var e = events[i];
                    // This extracts all the information we need from the event.
                    // Various ways of doing so are compared here: http://jsperf.com/angular-calendar-events-fingerprint/3
                    fpn = fpn + (e.id || '') + (e.title || '') + (e.url || '') + (+e.start || '') + (+e.end || '') +
                      (e.allDay || false);
                  }
                } else {
                  fpn = fpn + (events.url || '');
                }
              });
              return fpn;
            };
            /* update the calendar with the correct options */
            var updateView = function() {
              //calendar object exposed on scope
              scope.calendar = elm.html('');
              var view = scope.calendar.fullCalendar('getView');
              if(view){
                view = view.name; //setting the default view to be whatever the current view is. This can be overwritten.
              }
              /* If the calendar has options added then render them */
              var expression,
                options = {
                  defaultView : view,
                  eventSources: sources,
                  eventDrop: function() {
                    scope.$apply(attrs.eventDrop);
                  },
                  eventResize: function() {
                    scope.$apply(attrs.eventResize);
                  }
                };
              if (attrs.uiCalendar) {
                expression = scope.$eval(attrs.uiCalendar);
              } else {
                expression = {};
              }
              angular.extend(options, uiCalendarConfig, expression);
              scope.calendar.fullCalendar(options);
            };

            /* watches all eventSources */
            scope.$watch(eventsFingerprint, function() {
              updateView();
            });
         }
    };
}]);