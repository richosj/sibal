import gulp from 'gulp';
import plumber from 'gulp-plumber';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import postCss from 'gulp-postcss';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import fileInclude from 'gulp-file-include';
import cssnano from 'cssnano';
import cached from 'gulp-cached';
import { deleteSync } from 'del';

const sassCompiler = gulpSass(sass);
const server = browserSync.create();

const paths = {
  html: 'src/html/**/*.html',
  scss: 'src/assets/scss',
  js: 'src/assets/js/**/*.js',
  vendorJs: 'src/assets/js/vendor/**',
  images: 'src/assets/images/**/*',
  dist: 'dist',
  distCss: 'dist/assets/css',
  distJs: 'dist/assets/js',
  distVendorJs: 'dist/assets/js/vendor',
  distImages: 'dist/assets/images',
};

// Clean task
function clean() {
  return deleteSync([paths.dist]);
}

// HTML task
function html() {
  return gulp.src(paths.html)
    .pipe(plumber())
    .pipe(fileInclude({ 
      prefix: '@@', 
      basepath: '@file', 
      context: {
        page_main: false,
        page_name: null,
        page__name: null,
        title: null,
        menuTitle: null
      } 
    })) 
    .pipe(cached('html'))
    .pipe(gulp.dest(paths.dist))
    .pipe(server.stream());
}

// SCSS task
function styles() {
  return gulp.src(`${paths.scss}/index.scss`, { allowEmpty: true })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(postCss([autoprefixer(), cssnano()]))
    .pipe(rename('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.distCss))
    .pipe(server.stream());
}

// CSS Reset task
function cssReset() {
  return gulp.src(`${paths.scss}/reset.scss`, { allowEmpty: true })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(postCss([autoprefixer(), cssnano()]))
    .pipe(rename('reset.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.distCss));
}

// JavaScript task
function scripts() {
  return gulp.src([paths.js, `!${paths.vendorJs}`])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(rename('all.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.distJs))
    .pipe(server.stream());
}

// Vendor JavaScript task
function vendors() {
  return gulp.src(paths.vendorJs)
    .pipe(gulp.dest(paths.distVendorJs));
}

// Images task
function images() {
  return gulp.src(paths.images)
    .pipe(gulp.dest(paths.distImages));
}

// BrowserSync task
function serve() {
  server.init({
    server: {
      baseDir: paths.dist
    }
  });

  gulp.watch(paths.html, html);
  gulp.watch(`${paths.scss}/**/*.scss`, gulp.series(styles, cssReset));
  gulp.watch(paths.js, scripts);
  gulp.watch(paths.vendorJs, vendors);
  gulp.watch(paths.images, images);
}

// Build task
const build = gulp.series(clean, gulp.parallel(html, styles, cssReset, vendors, scripts, images));

// Default task
export default gulp.series(build, serve);
