# ui-calendar directive [![Build Status](https://travis-ci.org/angular-ui/ui-calendar.png?branch=master)](https://travis-ci.org/angular-ui/ui-calendar)

A complete AngularJS directive for the Arshaw FullCalendar.

# Requirements
- ([fullcalendar.css](https://raw.github.com/angular-ui/ui-calendar/gh-pages/bower_components/fullcalendar/fullcalendar.css))
- ([JQuery](http://arshaw.com/js/fullcalendar-1.5.3/fullcalendar/gcal.js))
- ([JQueryUI](http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js))
- ([AngularJS](http://code.angularjs.org/1.2.1/angular.js))
- ([fullcalendar.js](https://raw.github.com/angular-ui/ui-calendar/master/src/calendar.js))
- optional - ([gcal-plugin](http://arshaw.com/js/fullcalendar-1.5.3/fullcalendar/gcal.js))

# Testing

We use karma and grunt to ensure the quality of the code. 

    npm install -g grunt-cli
    npm install
    bower install
    grunt

# Usage

We use [bower](http://twitter.github.com/bower/) for dependency management.  Add

    dependencies: {
        "angular-ui-calendar": "latest"
    }

To your `components.json` file. Then run

    bower install

This will copy the ui-calendar files into your `components` folder, along with its dependencies. Load the script files in your application:

    <script type="text/javascript" src="bower_components/jquery/jquery.js"></script>
    <script type="text/javascript" src="bower_components/jquery-ui/ui/jquery-ui.js"></script>
    <script type="text/javascript" src="bower_components/angular/angular.js"></script>
    <script type="text/javascript" src="bower_components/angular-ui-calendar/src/calendar.js"></script>
    <script type="text/javascript" src="bower_components/fullcalendar/fullcalendar.js"></script>
    <script type="text/javascript" src="bower_components/fullcalendar/gcal.js"></script>

Add the calendar module as a dependency to your application module:

    var myAppModule = angular.module('MyApp', ['ui.calendar'])

Apply the directive to your div elements. The calendar must be supplied an array of decoumented event sources to render itself:

    <div ui-calendar ng-model="eventSources"></div>

## Options

All the Arshaw Fullcalendar options can be passed through the directive. This even means function objects that are declared on the scope. 

    myAppModule.controller('MyController', function($scope) {
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
    });

    <div ui-calendar="uiConfig.calendar" ng-model="eventSources">

## Working with ng-model

The ui-calendar directive plays nicely with ng-model.

An Event Sources objects needs to be created to pass into ng-model. This object will be watched for changes and update the calendar accordingly, giving the calendar some Angular Magic. 

The ui-calendar directive expects the eventSources object to be any type allowed in the documentation for the fullcalendar. [docs](http://arshaw.com/fullcalendar/docs/event_data/Event_Source_Object/)
Note that all calendar options are passed directly into `fullCalendar`, so you will need to wrap listeners to fullCalendar events in `scope.$apply`, as in example above.

## Accessing the calendar object

To avoid potential issues, by default the calendar object is not available in the parent scope. Access the object by declaring a calendar attribute name:

    <div ui-calendar="calendarOptions" ng-model="eventSources" calendar="myCalendar">
    
Now the calendar object is available in the parent scope:

    $scope.myCalendar.fullCalendar
    
This allows you to declare any number of calendar objects with distinct names.

## Custom event rendering

You can use fullcalendar's `eventRender` option to customize how events are rendered in the calendar.
However, only certain event attributes are watched for changes (they are `id`, `title`, `url`, `start`, `end`, `allDay`, and `className`).

If you need to automatically re-render other event data, you can use `calendar-watch-event`.
`calendar-watch-event` expression must return a function that is passed `event` as argument and returns a string or a number, for example:

    $scope.extraEventSignature = function(event) {
       returns "" + event.price;
    }

    <ui-calendar calendar-watch-event="extraEventSignature" ... >
    // will now watch for price

## Documentation for the Calendar

The calendar works alongside of all the documentation represented [here](http://arshaw.com/fullcalendar/docs)

## PR's R always Welcome                                                                                                                                                
PR's are welcome at any time. 
Make sure that if a new feature is added, that the proper tests are created.
We are following a linear approach to this directives history, so PR's are never merged through github's client. 
