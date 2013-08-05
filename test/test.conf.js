basePath = '..';
files = [
    JASMINE,
    JASMINE_ADAPTER,
    'bower_components/jquery/jquery.js',
    'bower_components/jquery-ui/ui/*.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'bower_components/fullcalendar/fullcalendar.js',
    'src/calendar.js',
    'test/*.spec.js'
];

singleRun = true;

browsers = ['Chrome'];

preprocessors = {
    '**/src/*.js': 'coverage'
};

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress', 'coverage'];