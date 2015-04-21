/**
 * Created by Alex on 14/04/2015.
 */
'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul');

var files={
    server:{
        js:'server/**/*.js',
        tests:'server/tests/**/*.js'
    }
};

gulp.task('test:server', function (done) {
    gulp.src(files.server.js)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function(){
            gulp.src(files.server.tests, {read: false})
                .pipe(mocha())
                .pipe(istanbul.writeReports())
                .on('end', done);
        });
});

gulp.task('watch',function(){
    gulp.watch(files.server.js,['test:server']);
});

gulp.task('test', ['test:server']);

gulp.task('build', function(){

});