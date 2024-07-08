const gulp = require('gulp');
const plumber = require('gulp-plumber');
const del = require('del');
const gulpSass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const postCss = require('gulp-postcss');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const fileInclude = require('gulp-file-include');
const minify = require('gulp-minify');
const cssnano = require('cssnano');
const cached = require('gulp-cached');

const paths = {
  html: 'src/**/*.html',
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  images: 'src/images/**/*',
  dist: 'dist',
  distCss: 'dist/css',
  distJs: 'dist/js',
  distImages: 'dist/images',
};

// Clean task
function clean() {
  return del([paths.dist]);
}

// HTML task
function html() {
  return gulp.src(paths.html)
    .pipe(plumber())
    .pipe(fileInclude())
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
}

// SCSS task
function styles() {
  return gulp.src(paths.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(postCss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.distCss))
    .pipe(browserSync.stream());
}

// JavaScript task
function scripts() {
  return gulp.src(paths.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(minify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.distJs))
    .pipe(browserSync.stream());
}

// Images task
function images() {
  return gulp.src(paths.images)
    .pipe(gulp.dest(paths.distImages));
}

// BrowserSync task
function serve() {
  browserSync.init({
    server: {
      baseDir: paths.dist
    }
  });

  gulp.watch(paths.html, html);
  gulp.watch(paths.scss, styles);
  gulp.watch(paths.js, scripts);
  gulp.watch(paths.images, images);
}

// Build task
const build = gulp.series(clean, gulp.parallel(html, styles, scripts, images));

// Default task
exports.default = gulp.series(build, serve);
