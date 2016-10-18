module.exports = function(grunt) {
  var uglify_files = {
    'public/build/app.js': [
      'tmp/vendor.js',
      'js/**.js',
    ]
  };
  var sass_files = {
    'public/build/app.css': 'scss/app.scss'
  };
  grunt.initConfig({
    'pkg': grunt.file.readJSON('package.json'),
    'clean': {
      'all': ['./public/build','./tmp']
    },
    'uglify': {
      'dist': {
        'files': uglify_files,
        'options': {
          'sourceMap': false,
          'compress': false,
          'mangle': false
        }
      },
      'dev': {
        'options': {
          'compress': false,
          'mangle': false,
          'beautify': true,
          'sourceMap': false
        },
        'files': uglify_files
      }
    },
    'sass': {
      'dist': {
        'options': {
          'style': 'compressed',
          'sourceMap': false
        },
        'files': sass_files
      },
      'dev': {
        'options': {
          'style': 'expanded',
          'sourceMap': false
        },
        'files': sass_files
      }
    },
    'watch': {
      'css': {
        'files': 'scss/**',
        'tasks': ['sass:dev']
      },
      'js': {
        'files': 'js/**',
        'tasks': ['uglify:dev']
      }
    },
    'connect': {
      'server': {
        'options': {
          'port': 4000,
          'base': 'public',
          'hostname': '*'
        }
      }
    },
    'bower_concat': {
      'vendor': {
        'dest': 'tmp/vendor.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.registerTask('default', ['dev','connect:server','watch']);
  grunt.registerTask('dev', [
    'clean:all',
    'bower_concat:vendor',
    'uglify:dev',
    'sass:dev'
  ]);
  grunt.registerTask('dist', [
    'clean:all',
    'bower_concat:vendor',
    'uglify:dist',
    'sass:dist'
  ]);
}
