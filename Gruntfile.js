// Generated on 2013-10-21 using generator-bootstrap-less 3.0.3
'use strict';

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    ftpush: {
      build: {
        auth: {
          // Create a .ftppass file in the root directory of your app with the FTP credentials.
          // Reference it from authKey and change the host and port here.
          // more info: https://github.com/inossidabile/grunt-ftpush
          host: 'wtfoto.net',
          port: 21,
          authKey: 'wtfoto'
        },
        src: 'dist',
        dest: '/gamell.io',
        exclusions: ['dist/**/.DS_Store', 'distt/**/Thumbs.db', 'dist/tmp'],
        keep: [] /*'/important/images/at/server/*.jpg'*/
      }
    },
    devcode: {
      options: {
        html: false,        // html files parsing?
        js: true,          // javascript files parsing?
        css: false,         // css files parsing?
        clean: true,       // removes devcode comments even if code was not removed
        block: {
          open: 'devcode', // with this string we open a block of code
          close: 'endcode' // with this string we close a block of code
        },
        dest: 'dist'       // default destination which overwrittes environment variable
      },
      server : {           // settings for task used with 'devcode:server'
        options: {
            source: '<%= yeoman.app %>/',
            dest: '.tmp/',
            env: 'development'
        }
      },
      dist : {             // settings for task used with 'devcode:dist'
        options: {
            source: 'dist/',
            dest: 'dist/',
            env: 'production'
        }
      }
    },
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee']
      },
      recess: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.less'],
        tasks: ['recess']
      },
      livereload: {
        files: [
          '<%= yeoman.app %>/*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['devcode:server','livereload']
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'app')
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, 'dist')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
   jshint: {
     options: {
       jshintrc: '.jshintrc'
     },
     all: [
       'Gruntfile.js',
       '<%= yeoman.app %>/scripts/{,*/}*.js',
       '!<%= yeoman.app %>/scripts/vendor/*',
       'test/spec/{,*/}*.js'
     ]
   },
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.options.port %>/index.html']
        }
      }
    },
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: '{,*/}*.coffee',
          dest: '<%= yeoman.app %>/scripts',
          ext: '.js'
        }]
      }
    },
    recess: {
      dist: {
        options: {
          compile: true,
          compress: true 
        },
        files: {
          '<%= yeoman.app %>/styles/main.css': ['<%= yeoman.app %>/styles/main.less'],
          '<%= yeoman.app %>/styles/print.css': ['<%= yeoman.app %>/styles/print.less']
        }
      }
    },
    // not used since Uglify task does concat,
    // but still available if needed
    /*concat: {
      dist: {}
    },*/
    // not enabled since usemin task does concat and uglify
    // check index.html to edit your build targets
    // enable this task if you prefer defining your build targets here
    /*uglify: {
      dist: {}
    },*/
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,vendor/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= yeoman.dist %>/fonts/{,*/}*.*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      js: '<%= yeoman.app %>/scripts/{,*/}*.js',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>'],
        patterns: {
          //html: [[/bower_components\/d3\/d3\.js/, 'Replacing reference to deferred.js']]
        }
      }
    },
    concat: {
      dist: { // custom scripts to concat. I put them here because I don't load them directly in the HTML, but through ajax.
        src: ['<%= yeoman.app %>/scripts/tipsy/src/javascripts/jquery.tipsy.js',
              '<%= yeoman.app %>/bower_components/d3/d3.js', 
              '<%= yeoman.app %>/bower_components/queue-async/queue.js', 
              '<%= yeoman.app %>/bower_components/topojson/topojson.js',
              '<%= yeoman.app %>/scripts/infographics/sunburst.js',
              '<%= yeoman.app %>/scripts/infographics/world-map.js'],
              //'<%= yeoman.app %>/scripts/infographics/timeline.js'],
        dest: '.tmp/concat/js/deferred.js'
      },
    },
    uglify: { // custom scripts to uglify. Same as above.
      dist: {
        options: {
          separator: ';',
        },
        files: {
          'dist/scripts/deferred/deferred.js': ['.tmp/concat/js/deferred.js']
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= yeoman.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          //removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          //collapseBooleanAttributes: true,
          //removeAttributeQuotes: true,
          //removeRedundantAttributes: true,
          //useShortDoctype: true,
          //removeEmptyAttributes: true,
          //removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            'scripts/*.json',
            'fonts/{,*/}*.*',
            'media/*.*',
            'ie8-warning/*.*',
            '.htaccess',
            'images/{,*/}*.{webp,gif}'
          ]
        }]
      },
      server: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>/bower_components/font-awesome/font/',
          dest: '<%= yeoman.app %>/fonts/font-awesome',
          src: ['*']
        }, {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>/bower_components/bootstrap/fonts/',
          dest: '<%= yeoman.app %>/fonts/glyphicons',
          src: ['*']
        }]
      }
    },
    concurrent: {
      dist: [
        'coffee',
        'recess',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'devcode:server',
      'coffee',
      'recess',
      'copy:server',
      'livereload-start',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'coffee',
    'recess',
    'copy:server',
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'copy:server',
    'useminPrepare',
    'concurrent',
    'cssmin',
    'concat',
    'devcode:dist',
    'uglify',
    'copy',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('deploy', [
    //'jshint',
    'test',
    'build',
    'ftpush'
  ]);

  grunt.registerTask('default', [
    //'jshint',
    'test',
    'build'
  ]);
};
