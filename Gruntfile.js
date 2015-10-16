module.exports = function(grunt) {

  grunt.registerTask('watch', [ 'watch' ]);

  grunt.initConfig({
    concat: {
      js: {
        options: {
          separator: ';'
        },
        src: [
          'assets/javascripts/libs/jquery.min.js', // jQuery
          'assets/javascripts/libs/owl-carousel/owl.carousel.js', // Creates the episode carousel http://owlgraphic.com/owlcarousel/
          'assets/javascripts/libs/moment/moment.js', // Makes the time from the soundcloud JSON in to prettier date format http://momentjs.com
          'assets/javascripts/libs/tappy/tappy.js', // Removes 300ms click for the mobile nav  https://github.com/filamentgroup/tappy
          'assets/javascripts/libs/one-page-nav/one-page-nav.js', // Controls scrolling to anchors and setting current class on nav https://github.com/davist11/jQuery-One-Page-Nav
          'assets/javascripts/libs/custom-scroll-bar/jquery.mCustomScrollbar.concat.min.js', // Creates the custom scrollbars on the episodes http://manos.malihu.gr/jquery-custom-content-scroller/
          'assets/javascripts/src/script.js' // Custom code 
        ],
        dest: 'assets/javascripts/script.min.js'
      },
    },

    uglify: {
      options: {
        mangle: false
      },
      js: {
        files: {
          'assets/javascripts/script.min.js': ['assets/javascripts/script.min.js']
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed',
          loadPath: 'assets/stylesheets/src/**/*'
        },
        files: {
          'assets/stylesheets/styles.css': 'assets/stylesheets/src/main.scss'
        }
      }
    },

    pleeease: {
      custom: {
        options: {
          autoprefixer: {"browsers": ["last 2 versions", "ios 7", "ie 8", "ie 9", "ie 10", "ie 11"]},
          filters: { "oldIE": true },
          rem: false
        },
        files: {
          'assets/stylesheets/styles.css': 'assets/stylesheets/styles.css'
        }
      }
    },

    watch: {
      js: {
        files: ['assets/javascripts/src/script.js'],
        tasks: ['concat:js', 'uglify:js'],
        options: {
          livereload: true,
        }
      },

      css: {
        files: ['assets/stylesheets/src/*.scss', 'assets/stylesheets/src/**/*.scss'],
        tasks: ['sass', 'pleeease'],
        options: {
          livereload: true,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-pleeease');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
