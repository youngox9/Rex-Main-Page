"use strict";

var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');
var webpack = require('webpack-stream');
var node_modules_dir = path.resolve('.', 'node_modules');
var autoprefixer = require('gulp-autoprefixer');
// var install = require("gulp-install");


//webpack
gulp.task('webpack', function () {
    return gulp.src('src/main.js')
        .pipe(webpack({
            watch: true,
            config: require('./build/webpack.base.conf.js')
        }))
        .pipe(gulp.dest('dist/'));
});
//sass-autoprefix
// 
gulp.task('sass', function () {
    console.log(`開始編譯SASS...`);

    gulp.src('scss/style.scss')
        .pipe(sourcemaps.init(
            { loadMaps: true }
        ))
        .pipe(sass({
            outputStyle: 'compressed',
        }))
        .on('error', onerror)
        .pipe(autoprefixer({
            browsers: [
                "> 1%",
                "Last 10 versions"
            ],
            cascade: false
        }))
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: '../scss'
        }))
        .pipe(gulp.dest('css/'))
        .on('end', () => {
            console.log(`====SASS編譯完成====`);
        });
});

//sass-no-autoprefix
//because of source map bugs
gulp.task('sass-no-autoprefix', function () {
    console.log(`開始編譯SASS...`);

    gulp.src('scss/style.scss')
        .pipe(sourcemaps.init(
            { loadMaps: true }
        ))
        .pipe(sass())
        .on('error', onerror)
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: '../scss'
        }))
        .pipe(gulp.dest('css/'))
        .on('end', () => {
            console.log(`====SASS編譯完成====`);
        });
});
//webserver
gulp.task('webserver', function () {
    const port = Math.floor(Math.random() * 1000) + 1000;
    gulp
        .src('.')
        .pipe(webserver({
            // https: true,
            port: 8080,
            // livereload: true,
            directoryListing: false,
            open: true
        }))
        .on('error', onerror)
});
// watch
gulp.task('watch', function () {
    gulp.watch('scss/**/*.scss', ['sass-no-autoprefix'])
});

// watch
gulp.task('watch-dev', function () {
    gulp.watch('scss/**/*.scss', ['sass'])
});
//gulp run watch with NO-autoprefix
gulp.task('default', function () {
    gulp.run('watch');
    gulp.run('webserver');
    gulp.run('webpack');
});

//gulp run watch with autoprefix
gulp.task('dev', function () {
    gulp.run('watch-dev');
    gulp.run('webserver');
    gulp.run('webpack');
});

// gulp on error
function onerror(error) {
    console.log(error.toString())
    this.emit('end')
}