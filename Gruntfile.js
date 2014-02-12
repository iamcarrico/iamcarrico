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
      jekyll: {
				files: ['{,**/}*.html', '_posts/*', '!_site/{,**/}*.html'],
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

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: 'images',
          src: ['**/*.png', '**/*.jpg'],
          dest: 'img/'
        }]
      }
    },



    parallel: {
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
    'compass:dist',
    'jekyll:prod',
  ]);

  grunt.registerTask('default', ['server']);
};
