'use strict';

// Causeway Capital Gulpfile
// (c) Small Axe Tech

// TASKS
// ------
// `gulp`: watch, compile styles and scripts; Browserify
// `gulp build`: default compile task

// PLUGINS
// --------
import browserSync from 'browser-sync';
import browserify from 'browserify';
import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import sourcestream from 'vinyl-source-stream';
import iconfont from 'gulp-iconfont';

// VARIABLES
// ----------
const $ = gulpLoadPlugins();
const sync = browserSync.create();

const dist = 'assets';
const appRoot = '.';
const source = 'src';

// BUILD SUBTASKS
// ---------------

// Styles
gulp.task('stylelint', function () {
  return gulp.src([
    `${source}/scss/**/*.s+(a|c)ss`,
    `${source}/scss/**/*.css`,
    `!${source}/scss/vendor/**`,
  ])
    .pipe($.stylelint({
      reporters: [
        {
          formatter: 'string',
          console: true,
        },
      ],
    }));
});

gulp.task('styles', ['stylelint'], function () {
  return gulp.src([
    `${source}/scss/style.scss`,
  ])
    .pipe($.sourcemaps.init())
    .pipe($.sass({ includePaths: ['node_modules'] }))
    .on('error', $.notify.onError())
    .pipe($.autoprefixer())
    .pipe($.cleanCss())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(`./${dist}/css/`))
    .pipe(sync.stream({ match: '**/*.css' }));
});

// Lint JavaScript
gulp.task('lint', () =>
  gulp.src([
    `${source}/js/**/*.js`,
    'gulpfile.babel.js',
    '!node_modules/**',
    `!${source}/js/vendor/**`,
  ]).pipe($.eslint())
    .pipe($.eslint.format())
);

// Browserify
gulp.task('browserify', function () {
  return browserify({
    entries: `${source}/js/main.js`,
    debug: true,
    paths: ['node_modules', `${source}/js`],
  })
    .transform('babelify', { presets: ['es2015'] })
    .bundle()
    .pipe(sourcestream('bundle.js'))
    .pipe(gulp.dest(`${dist}/js`));
});

// Scripts
gulp.task('scripts', ['browserify'], function () {
  return gulp.src([
    `${source}/js/vendor/_*.js`,
    `${dist}/js/bundle.js`,
  ])
    .pipe($.babel({
      presets: ['es2015'],
      compact: true,
    }))
    .pipe($.concat('source.dev.js'))
    .pipe(gulp.dest(`${dist}/js`))
    .pipe($.rename('source.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(`${dist}/js`))
    .pipe(sync.stream({ match: '**/*.js' }));
});

// Clean
gulp.task('clean', function (cb) {
  del([`${dist}/js/source.dev.js`, `${dist}/js/source.js`], cb);
});

// Images
gulp.task('images', function () {
  return gulp.src(`${source}/images/**/*`)
    .pipe($.cache($.imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true,
    })))
    .pipe(gulp.dest(`${dist}/images`))
    .pipe($.notify({ message: 'Images task complete' }));
});

// BUILD TASKS
// ------------

// Watch
gulp.task('default', function () {
  sync.init({
    proxy: 'http://localhost/',
    port: 3001,
    ghostMode: {
      scroll: true,
    },
    open: false,
  });

  // Watch .scss files
  gulp.watch(`${source}/scss/**/*.scss`, ['styles']);

  // Watch .js files
  gulp.watch(`${source}/js/**/*.js`, ['scripts']);

  // Watch image files
  gulp.watch(`${source}/images/**/*`, ['images']);
});

// Build
gulp.task('build', ['clean'], function () {
  gulp.start('styles', 'scripts');
});
