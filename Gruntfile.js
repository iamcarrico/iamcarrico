'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    watch: {
      options: {
        livereload: 9001
      },
      css: {
        files: ['sass/{,**/}*.scss'],
        tasks: ['compass:dev', 'jekyll:dev']
      },
//      js: {
//        files: [
//          'js/{,**/}*.js',
//          '!js/{,**/}*.js'
//        ],
//        tasks: ['jshint', 'uglify:dev', 'jekyll:dev']
//      },
      jekyll: {
				files: ['{,**/}*.html', '!_site/{,**/}*.html'],
				tasks: ['jekyll:dev']
			}
    },

    compass: {
      options: {
        config: 'config.rb',
        bundleExec: true
      },
      dev: {
        options: {
          environment: 'development'
        }
      },
      dist: {
        options: {
          environment: 'production',
          imagesDir: 'img',
          force: true
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'js/{,**/}*.js',
        '!js/{,**/}*.min.js'
      ]
    },

    concat: {
      options: {
        separator: ';'
      },
      modernizr: {
        src: [
          '_js/vendor/modernizr.min.js'
        ],
        dest: 'js/dist/modernizr.min.js'
      },
    },

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: 'img',
          src: ['**/*.png', '**/*.jpg'],
          dest: 'img-min/'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'img',
          src: '**/*.svg',
          dest: 'img-min'
        }]
      }
    },

    uglify: {
      dev: {
        options: {
          mangle: false,
          compress: false,
          beautify: true
        },
        files: [{
          expand: true,
          cwd: 'js',
          src: ['**/*.js', '!**/*.min.js'],
          dest: 'js',
          ext: '.min.js'
        }]
      },
      dist: {
        options: {
          mangle: true,
          compress: true
        },
        files: [{
          expand: true,
          cwd: 'js',
          src: ['**/*.js', '!**/*.min.js'],
          dest: 'js',
          ext: '.min.js'
        }]
      }
    },

    parallel: {
      assets: {
        grunt: true,
        tasks: ['imagemin', 'svgmin', 'uglify:dist']
      },
      server: {
        grunt: true,
        tasks: ['jekyll:server', 'watch'],
      }
    },

    jekyll: {
			server : {
				server : true,
				server_port : 4000,
				bundleExec: true,
				config: '_config_dev.yml',
			},
			dev: {
				bundleExec: true,
				config: '_config_dev.yml',
			},
			prod: {
  			bundleExec: true,
			}
		},
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-parallel');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jekyll');

  grunt.registerTask('server', ['parallel:server']);

  grunt.registerTask('deploy', [
    'parallel:assets',
    'compass:dist',
//    'concat',
//    'jshint',
    'jekyll:prod',
  ]);

  grunt.registerTask('default', ['server']);
};
