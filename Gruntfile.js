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
    },

    sass: {
      prod: {
        files: {
          "dist/css/screen.css": "build/scss/screen.scss"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('default', ['browserify', 'sass']);

};