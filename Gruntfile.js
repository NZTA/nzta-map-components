module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dist: {
        files: {
          'dist/js/app.js': [
            'build/js/**/*.js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['browserify']);

};