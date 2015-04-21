/**
 * Created by Alex on 14/04/2015.
 */
'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha');

var files={
    server:{
        js:'server/tests/**/*.js'
    }
};

gulp.task('test:server', function () {
    gulp.src(files.server.js, {read: false})
        .pipe(mocha());
});

gulp.task('watch',function(){
    gulp.watch(files.server.js,['test:server']);
});

gulp.task('test', ['test:server']);

gulp.task('build', function(){

});