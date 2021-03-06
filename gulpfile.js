'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var jade = require('gulp-jade');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var sourcemaps = require('gulp-sourcemaps');

var inlineCss = require('gulp-inline-css');
var inlineSource = require('gulp-inline-source');

var rename = require('gulp-rename');


gulp.task('styles', function() {
  return gulp.src('app/styles/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./app/styles'))
    .pipe(reload({stream: true}));
});
gulp.task('styles:watch', function () {
  gulp.watch('app/styles/scss/main.scss', ['styles']);
});

gulp.task('inline', ['styles', 'jade'], function() {
  return gulp.src('app/*.html')
    .pipe(inlineSource({
      rootpath: 'app'
    }))
    .pipe(inlineCss({
      preserveMediaQueries: true
    }))
    .pipe(gulp.dest('dist/'));
});


gulp.task('jade', function() {
  return gulp.src('app/template/*.jade')
    .pipe(jade({
      pretty: true,
      compileDebug: true
    }))
    .pipe(gulp.dest('app/'));
});


gulp.task('clean', require('del').bind(null, 'dist'));

gulp.task('build', ['clean','inline']);

gulp.task('serve', ['styles', 'jade'], function() {
  browserSync({
    server: './app',
    notify: false,
    debugInfo: false,
    host: 'localhost'
  });

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/*.html').on('change', reload);
  gulp.watch('app/template/**/*.jade', ['jade']);
});

gulp.task('serve:dist', ['inline'], function() {
  browserSync({
    server: './dist',
    notify: false,
    debugInfo: false,
    host: 'localhost'
  });
});
