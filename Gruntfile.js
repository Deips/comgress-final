// Grunt tasks

module.exports = function (grunt) {
	"use strict";

	// Project configuration.
	const sass = require('node-sass');

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
		'* <%= pkg.name %> - v<%= pkg.version %> - MIT LICENSE <%= grunt.template.today("yyyy-mm-dd") %>. \n' +
		'* @author <%= pkg.author %>\n' +
		'*/\n',

		clean: {
			dist: ['src']
		},

		sass: {
			options: {
				implementation: sass,
				sourceMap: true
			},
			dist: {
				files: [{
					src: ['src/app/main.scss'],
					dest: 'src/app/assets/css/styles.css'
				}]
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			app: {
				src: ['src/app/modules/**/*.js']
			}
		},

		exec: {
			bowerInstaller: 'bower-installer'
		},

		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: false
			},
			base: {
				src: [
					// Angular Project Dependencies,
					'src/app/app.js',
					'src/app/app.config.js',
					'src/app/modules/**/*.js'
				],
				dest: 'src/app/assets/js/<%= pkg.name %>-appbundle.js'
			},
			build: {
				src: [
					// Angular Project Dependencies,
					'src/app/assets/libs/angular/angular.js',
					'src/app/assets/libs/**/*.js'
				],
				dest: 'src/app/assets/js/<%= pkg.name %>-angularbundle.js'
			}
		},

		uglify: {
			options: {
				banner: '<%= banner %>',
				report: 'min'
			},
			base: {
				src: ['<%= concat.base.dest %>'],
				dest: 'src/app/assets/js/<%= pkg.name %>-angscript.min.js'
			},
			basePlugin: {
				src: [ 'plugins/**/*.js' ],
				dest: 'src/app/assets/js/plugins/',
				expand: true,
				flatten: true,
				ext: '.min.js'
			}
		},

		connect: {
			server: {
				options: {
					keepalive: true,
					port: 4000,
					base: '.',
					hostname: 'localhost',
					debug: true,
					livereload: true,
					open: true
				}
			}
		},
		concurrent: {
			tasks: ['connect', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},

		watch: {
			app: {
				files: '<%= jshint.app.src %>',
				tasks: ['jshint:app'],
				options: {
					livereload: true
				}
			},
			css: {
        files: 'src/app/**/*.scss',
				tasks: ['sass'],
        options: {
            spawn: false,
            livereload: true
        }
    	}
		},

		injector: {
			options: {},
			dev: {
				files: {
					'index.html': [
						'bower.json',
						'src/app/app.js',
						'src/app/app.config.js',
						'src/app/assets/css/**/*.css',
						'bower_components/bootstrap/dist/css/*.min.css',
						'src/app/**/*.js'
					]
				}
			},
			production: {
				files: {
					'index.html': [
						'src/app/assets/css/**/*.css',
						'src/app/assets/js/*.js'
					]

				}
			}
		},

		ngtemplates: {
			app: {
				src: 'src/app/modules/**/*.html',
				dest: 'src/app/assets/js/templates.js',
				options: {
					module: '<%= pkg.name %>',
					root: 'src/app/',
					standAlone: false
				}
			}
		}



	});

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project if something fail.
	grunt.option('force', true);

	// Register grunt tasks
	grunt.registerTask("build", [
		"jshint",
		"exec",
		"concat",
		"ngtemplates",
		"injector:production",
		"sass",
		"concurrent",
		"clean"
	]);

	// Development task(s).
	grunt.registerTask('dev', ['sass', 'injector:dev', 'concurrent']);

};
