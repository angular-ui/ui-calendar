/*global beforeEach, afterEach, describe, it, inject, expect, module, spyOn, fullcalendar, angular, $*/
describe('uiCalendar', function () {
    'use strict';

    var scope, $compile, $locale, $controller;

    //Date Objects needed for event
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    beforeEach(module('ui.calendar'));
    beforeEach(inject(function (_$rootScope_, _$compile_, _$locale_,_$controller_) {
        scope = _$rootScope_.$new();
        $compile = _$compile_;
        $locale = _$locale_;
        $controller = _$controller_;

          // create an array of events, to pass into the directive. 
          scope.events = [
            {title: 'All Day Event',start: new Date(y, m, 1),url: 'http://www.angularjs.org'},
            {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: true}];

          // create an array of events, to pass into the directive. 
          scope.events2 = [
            {title: 'All Day Event 2',start: new Date(y, m, 1),url: 'http://www.atlantacarlocksmith.com'},
            {title: 'Long Event 2',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
            {id: 998,title: 'Repeating Event 2',start: new Date(y, m, d - 3, 16, 0),allDay: false},
            {id: 998,title: 'Repeating Event 2',start: new Date(y, m, d + 4, 16, 0),allDay: true}];
          //array to test equals occurance
          scope.events3 = [
            {title: 'All Day Event 3',start: new Date(y, m, 1),url: 'http://www.atlantacarlocksmith.com'},
            {title: 'Long Event 3',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
            {id: 998,title: 'Repeating Event 3',start: new Date(y, m, d - 3, 16, 0),allDay: false},
            {id: 998,title: 'Repeating Event 3',start: new Date(y, m, d + 4, 16, 0),allDay: true}];

          scope.calEventsExt = {
             color: '#f00',
             textColor: 'yellow',
             events: [ 
                {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
                {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
                {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
              ]
          };

          // create an array of events, to pass into the directive. 
          scope.events4 = [{title: 'All Day Event 3',start: new Date(y, m, 1),url: 'http://www.yoyoyo.com'}];

          //event Sources array  
          scope.eventSources = [scope.events,scope.events2]; //End of Events Array
          
          scope.addSource = function(source) {
            scope.eventSources.push(source);
          };

          scope.addChild = function(array) {
            array.push({
              title: 'Click for Google ' + scope.events.length,
              start: new Date(y, m, 28),
              end: new Date(y, m, 29),
              url: 'http://google.com/'
            });
          };

          scope.remove = function(array,index) {
            array.splice(index,1);
          };

          scope.uiConfig = {
            calendar:{
              height: 200,
              weekends: false,
              defaultView: 'month'
           }
          };
         
    }));

    describe('compiling this directive and checking for events inside the calendar', function () {

        it('sets names for $locale by default', function() {
            spyOn($.fn, 'fullCalendar');
            $locale.DATETIME_FORMATS.MONTH[0] = 'enero';
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            scope.$apply();
            expect($.fn.fullCalendar.mostRecentCall.args[0].monthNames[0]).toBe('enero');
        });

        it('allows overriding names for $locale', function() {
          spyOn($.fn, 'fullCalendar');
          scope.uiConfig.calendar.monthNames = $locale.DATETIME_FORMATS.MONTH.slice();
          scope.uiConfig.calendar.monthNames[0] = 'custom name';
          $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
          scope.$apply();
          expect($.fn.fullCalendar.mostRecentCall.args[0].monthNames[0]).toBe('custom name');
        });

        /* test the calendar's events length  */
        it('expects to load 4 events to scope', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            scope.$apply();
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length).toBe(4);
        });
        /* test to check the title of the first event. */
        it('expects to be All Day Event', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            scope.$apply();
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[0][0].title).toBe('All Day Event');
        });
        /* test to make sure the event has a url assigned to it. */
        it('expects the url to = http://www.angularjs.org', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            scope.$apply();
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[0][0].url).toBe('http://www.angularjs.org');
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[1][0].url).toBe('http://www.atlantacarlocksmith.com');
        });
        /* test the 3rd events' allDay field. */
        it('expects the fourth Events all Day field to equal true', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar"   ng-model="eventSources"></div>')(scope);
            scope.$apply();
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[0][3].allDay).toNotBe(false);
        });
        /* Tests the height of the calendar. */
        it('expects the calendar attribute height to be 200', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar"  ng-model="eventSources"></div>')(scope);
            scope.$apply();
            expect($.fn.fullCalendar.mostRecentCall.args[0].height).toEqual(200);  
        });
        /* Tests the weekends boolean of the calendar. */
        it('expects the calendar attribute weekends to be false', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            scope.$apply();
            expect($.fn.fullCalendar.mostRecentCall.args[0].weekends).toEqual(false);
        });
        /* Test to make sure that when an event is added to the calendar everything is updated with the new event. */
        it('expects the scopes events to increase by 2', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar"  ng-model="eventSources"></div>')(scope);
            scope.$apply();
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length).toEqual(4);
            scope.addChild(scope.events);
            scope.addChild(scope.events);
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length).toEqual(6);
        });
        /* Test to make sure the calendar is updating itself on changes to events length. */
        it('expects the calendar to update itself with new events', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar"  ng-model="eventSources"></div>')(scope);
            scope.$apply();
            var clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            expect(clientEventsLength).toEqual(4);
            //remove an event from the scope.
            scope.remove(scope.events,0);
            //events should auto update inside the calendar. 
            clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            expect(clientEventsLength).toEqual(3);
        });
        /* Test to make sure header options can be overwritten */
        it('overwrites default header options', function () {
            spyOn($.fn, 'fullCalendar');
            scope.uiConfig2 = {
              calendar:{
                header: {center: 'title'} 
             }
            };
            $compile('<div ui-calendar="uiConfig2.calendar"  ng-model="eventSources"></div>')(scope);
            scope.$apply();
            expect($.fn.fullCalendar.mostRecentCall.args[0].hasOwnProperty('header')).toEqual(true);
            var header = $.fn.fullCalendar.mostRecentCall.args[0].header;
            expect(header).toEqual({center: 'title'});
        });
        /* Test to see if calendar is watching all eventSources for changes. */
        it('updates the calendar if any eventSource array contains a delta', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            scope.$apply();
            var clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            var clientEventsLength2 = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[1].length;
            expect(clientEventsLength).toEqual(4);
            expect(clientEventsLength2).toEqual(4);
            //remove an event from the scope.
            scope.remove(scope.events2,0);
            //events should auto update inside the calendar. 
            clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            clientEventsLength2 = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[1].length;
            expect(clientEventsLength).toEqual(4);
            expect(clientEventsLength2).toEqual(3);
            scope.remove(scope.events,0);
            clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            expect(clientEventsLength).toEqual(3);
        });
        /* Test to see if calendar is updating when a new eventSource is added. */
        it('updates the calendar if an eventSource is Added', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar"  ng-model="eventSources"></div>')(scope);
            scope.$apply();
            var clientEventSources = $.fn.fullCalendar.mostRecentCall.args[0].eventSources.length;
            expect(clientEventSources).toEqual(2);
            //add new source to calendar
            scope.addSource(scope.events4);
            //eventSources should auto update inside the calendar. 
            clientEventSources = $.fn.fullCalendar.mostRecentCall.args[0].eventSources.length;
            expect(clientEventSources).toEqual(3);
            //go ahead and add some more events to the array and check those too.
            scope.addChild(scope.events4);
            var clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[2].length;
            expect(clientEventsLength).toEqual(2);
        });
        /* Test to see if calendar is updating when an eventSource replaces another with an equal length. */
        it('updates the calendar if an eventSource has same length as prior eventSource', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            scope.$apply();
            var clientEventSources = $.fn.fullCalendar.mostRecentCall.args[0].eventSources;
            var clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            expect(clientEventsLength).toEqual(4);
            expect(clientEventSources.length).toEqual(2);
            expect(clientEventSources[1][0].title).toEqual('All Day Event 2');
            //replace source with one that has the same length
            scope.eventSources.splice(1,1,scope.events3);
            //eventSources should update inside the calendar
            clientEventSources = $.fn.fullCalendar.mostRecentCall.args[0].eventSources;
            expect(clientEventSources.length).toEqual(2);
            expect(clientEventSources[1][0].title).toEqual('All Day Event 3');
            //remove an event to prove autobinding still works
            scope.remove(scope.events,0);
            clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            expect(clientEventsLength).toEqual(3);
        });

        it('make sure the calendar can work with extended event sources', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            scope.$apply();
            var clientEventSources = $.fn.fullCalendar.mostRecentCall.args[0].eventSources;
            var clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            scope.eventSources.push(scope.calEventsExt);
            clientEventSources = $.fn.fullCalendar.mostRecentCall.args[0].eventSources;
            expect(clientEventSources.length).toEqual(3);
            expect(clientEventSources[2].events[0].title).toEqual('Lunch');
        });

        it('make sure the calendar sets the myCalendar object to defining scope', function () {
            expect(scope.myCalendar).toBe(undefined);
            $compile('<div ui-calendar="uiConfig.calendar" calendar="myCalendar" ng-model="eventSources"></div>')(scope);
            scope.$apply();
             expect(scope.myCalendar).not.toBe(undefined);
        });

    });

    describe('calendarCtrl', function(){
        
        var calendar,
            calendarCtrl,
            sourcesChanged;

        function onFnAdd(source) {
            sourcesChanged = 'added';
        }

        function onFnRemove(source) {
            sourcesChanged = 'removed';
        }

        function onFnChanged(source) {
            sourcesChanged = 'changed';
        }

        beforeEach(function(){
          calendarCtrl = $controller('uiCalendarCtrl', {$scope: scope, $element: null});
          sourcesChanged = false;
          scope.$apply();
        });

        it('make sure changeWatcher is initialized', function () {
          expect(calendarCtrl.changeWatcher).not.toBe(undefined);
        });

        it('makes sure the correct function is called when an event source is added or removed', function () {
          var sourceWatcher = calendarCtrl.changeWatcher(scope.eventSources,calendarCtrl.sourcesFingerprint);
          expect(sourcesChanged).toBe(false);
          sourceWatcher.subscribe(scope);
          sourceWatcher.onAdded = onFnAdd;
          sourceWatcher.onRemoved = onFnRemove;
          scope.$apply();
          scope.eventSources.push(scope.events3);
          scope.$apply();
          expect(sourcesChanged).toBe('added');
          scope.eventSources.splice(0,1);
          scope.$apply();
          expect(sourcesChanged).toBe('removed');
        });

        it('makes sure the correct function is called when a single event is added or removed', function () {
          var eventsWatcher = calendarCtrl.changeWatcher(calendarCtrl.allEvents,calendarCtrl.eventsFingerprint);
          expect(sourcesChanged).toBe(false);
          eventsWatcher.subscribe(scope);
          eventsWatcher.onAdded = onFnAdd;
          eventsWatcher.onRemoved = onFnRemove;
          eventsWatcher.onChanged = onFnChanged;
          scope.$apply();
          scope.events2.push({id: 8,title: 'Repeating Event 2',start: new Date(y, m, d - 3, 16, 0),allDay: false});
          scope.$apply();
          expect(sourcesChanged).toBe('added');
          scope.events2.splice(0,1);
          scope.$apply();
          expect(sourcesChanged).toBe('removed');
          scope.events2[0].title = 'tester :)';
          scope.$apply();
          expect(sourcesChanged).toBe('changed');
        });

        it('makes sure the correct function is called when the calendarWatchEvent function is return variable is altered', function () {
          scope.testX = 0;

          scope.calendarWatchEvent = function(){
            return scope.testX;
          };

          var calendarCtrl2 = $controller('uiCalendarCtrl', {$scope: scope, $element: null});
          scope.$apply();

          var eventsWatcher = calendarCtrl2.changeWatcher(calendarCtrl2.allEvents,calendarCtrl2.eventsFingerprint);
          expect(sourcesChanged).toBe(false);
          eventsWatcher.subscribe(scope);
          eventsWatcher.onAdded = onFnAdd;
          eventsWatcher.onRemoved = onFnRemove;
          eventsWatcher.onChanged = onFnChanged;
          scope.$apply();
          scope.testX++;
          scope.$apply();
          expect(sourcesChanged).toBe('changed');
        });

        it('makes sure that eventSources in extended form are tracked properly', function () {
          scope.testX = 0;
          scope.eventSources.push(scope.calEventsExt);
          var calendarCtrl2 = $controller('uiCalendarCtrl', {$scope: scope, $element: null});
          scope.$apply();
          var eventsWatcher = calendarCtrl2.changeWatcher(calendarCtrl2.allEvents,calendarCtrl2.eventsFingerprint);
          expect(sourcesChanged).toBe(false);
          eventsWatcher.subscribe(scope);
          eventsWatcher.onAdded = onFnAdd;
          eventsWatcher.onRemoved = onFnRemove;
          eventsWatcher.onChanged = onFnChanged;
          scope.$apply();
          scope.calEventsExt.events[0].title = 'Brunch';
          scope.$apply();
          expect(sourcesChanged).toBe('changed');
          scope.calEventsExt.events[0].title = 'Brunch';
          scope.calEventsExt.events.push({type:'party',title: 'Bunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false});
          scope.$apply();
          expect(sourcesChanged).toBe('added');
          scope.calEventsExt.events[0].title = 'Brunch';
          scope.calEventsExt.events.splice(0,1);
          scope.$apply();
          expect(sourcesChanged).toBe('removed');
        });

    });

});
