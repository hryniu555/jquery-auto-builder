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
        src: ['lib/**/*.js', 'bin/**/*.js', 'tools/**/*.js']
      }
    },
		mochaTest: {
			test:{
				options:{
					reporter: 'spec'
				},
				src: ['test/**/*.js']
			}
		},
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      scripts: {
        files: ['**/*.js'],
        tasks: ['jshint', 'mochaTest']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'mochaTest']
      }
    }
  });

  
  // Default task.
  grunt.registerTask('default', ['jshint','mochaTest','watch']);

};
