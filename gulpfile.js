const gulp = require('gulp');
const minify = require('gulp-minify');
const concat = require('gulp-concat');

gulp.task('build:node', () => {
  return gulp
    .src('dist/wumpfetch.concat.js')
    .pipe(minify({ noSource: true, ext: { min: '.min.js' } }))
    .pipe(gulp.dest('dist'));
});

gulp.task('concat', () => {
  return gulp
    .src('lib/**/*.js')
    .pipe(concat('wumpfetch.concat.js'))
    .pipe(gulp.dest('dist'));
});