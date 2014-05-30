/*global module:false*/
module.exports = function(grunt) {

	"use strict";

  // These plugins provide necessary tasks.
  require( "load-grunt-tasks" )( grunt );
  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['test/**/*.js']
      },
      files: {
        src: ['lib/**/*.js', 'bin/**/*.js', '!lib/jquery/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      scripts: {
        files: ['lib/**/*.js', 'bin/**/*.js', '!lib/jquery/**/*.js'],
        tasks: ['jshint']
      }
    }
  });

  
  // Default task.
  grunt.registerTask('default', ['jshint','watch']);

};
