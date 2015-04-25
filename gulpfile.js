/**
 * Created by Alex on 14/04/2015.
 */
'use strict';

var path = require('path'),
	gulp = require('gulp'),
	mocha = require('gulp-mocha'),
	istanbul = require('gulp-istanbul'),
	sourceMaps = require('gulp-sourcemaps'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	ngAnnotate = require('gulp-ng-annotate'),
	less = require('gulp-less'),
	minifyCss = require('gulp-minify-css');

var files = {
	server: {
		js: 'server/**/*.js',
		tests: 'server/tests/**/*.js'
	},
	client: {
		images: 'client/images/**/*.*',
		js: {
			vendor: [
				'bower_components/jquery/dist/jquery.js',
				'bower_components/bootstrap/dist/js/bootstrap.js',
				'bower_components/angular/angular.js',
				'bower_components/angular-route/angular-route.js',
				'bower_components/socket.io-client/socket.io.js'
			],
			app: [
				'client/js/application.js',
				'client/js/**/*.js'
			]
		},
		css: 'client/css/application.less',
		views: 'client/views/**/*.html'
	}
};

gulp.task('client:images', function () {
	gulp.src(files.client.images)
		.pipe(gulp.dest('public/images'));
});
gulp.task('client:views', function () {
	gulp.src(files.client.views)
		.pipe(gulp.dest('public/views'));
});
gulp.task('client:js:vendor', function () {
	gulp.src(files.client.js.vendor)
		.pipe(sourceMaps.init())
		.pipe(concat('vendor.js'))
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('public/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'));
});
gulp.task('client:js:app', function () {
	gulp.src(files.client.js.app)
		.pipe(sourceMaps.init())
		.pipe(concat('app.js'))
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('public/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(ngAnnotate({gulpWarnings: false}))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'));
});
gulp.task('client:css', function () {
	gulp.src(files.client.css)
		.pipe(sourceMaps.init())
		.pipe(less())
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('public/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourceMaps.init())
		.pipe(minifyCss())
		.pipe(gulp.dest('public/css'));
});
gulp.task('client', ['client:images', 'client:views', 'client:js:vendor', 'client:js:app', 'client:css']);

gulp.task('test:server', function (done) {
	gulp.src(files.server.js)
		.pipe(istanbul())
		.pipe(istanbul.hookRequire())
		.on('finish', function () {
			gulp.src(files.server.tests, {read: false})
				.pipe(mocha())
				.pipe(istanbul.writeReports())
				.on('end', done);
		});
});
gulp.task('test', ['test:server']);

gulp.task('watch', ['build'], function () {
	gulp.watch(files.server.js, ['test:server']);
	gulp.watch(files.client.images, ['client:images']);
	gulp.watch(files.client.views, ['client:views']);
	gulp.watch(files.client.js.vendor, ['client:js:vendor']);
	gulp.watch(files.client.js.app, ['client:js:app']);
	gulp.watch(files.client.css, ['client:css']);
});


gulp.task('build', ['client'], function () {

});
