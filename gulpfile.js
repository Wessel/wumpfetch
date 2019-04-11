const g = require('gulp');
const m = require('gulp-minify');
const c = require('gulp-concat');

g.task('build:node', () => {
  return g
    .src('dist/wumpfetch.concat.js')
    .pipe(m({ noSource: true, ext: { min: '.min.js' } }))
    .pipe(g.dest('dist'));
});

g.task('concat', () => {
  return g
    .src('lib/**/*.js')
    .pipe(c('wumpfetch.concat.js'))
    .pipe(g.dest('dist'));
});