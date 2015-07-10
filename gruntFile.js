module.exports = function (grunt) {
  "use strict";

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Default task.
  grunt.registerTask('default', ['jshint', 'karma']);

  // uglify
  grunt.registerTask('minify', ['uglify']);
  //connect - local server 
  grunt.registerTask('serve', ['connect']);

  var testConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  // Project configuration.
  grunt.initConfig({
    karma: {
      unit: {
        options: testConfig('test/test.conf.js')
      }
    },
    jshint: {
      files: ['src/**/*.js', 'test/**/*.js', 'demo/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: 'nofunc',
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true,
        globals: {}
      }
    },
    uglify: {
      build: {
        src: ['src/**/*.js'],
        dest: 'calendar.min.js'
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
            open: true,
            debug: true,
            keepalive: true,
            hostname: '*',
            base: ['demo', '.']
          }
        }
    }
  });

};
