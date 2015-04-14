/**
 * Created by Alex on 14/04/2015.
 */
'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha');

gulp.task('test:server', function () {
    gulp.src('server/tests/**/*.js', {read: false})
        .pipe(mocha());
});
gulp.task('test', ['test:server']);