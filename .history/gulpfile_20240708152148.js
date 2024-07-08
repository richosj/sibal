import gulp from 'gulp';
import plumber from 'gulp-plumber';
import del from 'del';
import gulpSass from 'gulp-sass';
import sass from 'sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import postCss from 'gulp-postcss';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import fileInclude from 'gulp-file-include';
import minify from 'gulp-minify';
import cssnano from 'cssnano';
import cached from 'gulp-cached';

const { src, dest, series, parallel, watch } = gulp;
const scssCompiler = gulpSass(sass);
const server = browserSync.create();

const paths = {
  html: 'src/aseets/**/*.html',
  scss: 'src/aseets/scss/**/*.scss',
  js: 'src/aseets/js/**/*.js',
  images: 'src/aseets/images/**/*',
  dist: 'dist',
  distCss: 'dist/aseets/css',
  distJs: 'dist/aseets/js',
  distImages: 'dist/aseets/images',
};

// Clean task
function clean() {
  return del([paths.dist]);
}

// HTML task
function html() {
  return src(paths.html)
    .pipe(plumber())
    .pipe(fileInclude())
    .pipe(dest(paths.dist))
    .pipe(server.stream());
}

// SCSS task
function styles() {
  return src(paths.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(scssCompiler().on('error', scssCompiler.logError))
    .pipe(postCss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.distCss))
    .pipe(server.stream());
}

// JavaScript task
function scripts() {
  return src(paths.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(minify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.distJs))
    .pipe(server.stream());
}

// Images task
function images() {
  return src(paths.images)
    .pipe(dest(paths.distImages));
}

// BrowserSync task
function serve() {
  server.init({
    server: {
      baseDir: paths.dist
    }
  });

  watch(paths.html, html);
  watch(paths.scss, styles);
  watch(paths.js, scripts);
  watch(paths.images, images);
}

// Build task
const build = series(clean, parallel(html, styles, scripts, images));

// Default task
export default series(build, serve);
