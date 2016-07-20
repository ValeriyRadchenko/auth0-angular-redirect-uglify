
'use strict';


module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');


  // Define the configuration for all the tasks
  grunt.initConfig({
    uglify: {
      my_target: {
        files: {
          'scripts/output.min.js': ['scripts/myApp.js', 'scripts/controllers.js']
        }
      }
    }
  });


  grunt.registerTask('default', ['uglify']);
};
