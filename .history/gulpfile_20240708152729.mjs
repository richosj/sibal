import gulp from 'gulp';
import plumber from 'gulp-plumber';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
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

const sass = gulpSass(dartSass);
const server = browserSync.create();

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
async function clean() {
  const del = (await import('del')).deleteSync;
  return del([paths.dist]);
}

// HTML task
function html() {
  return gulp.src(paths.html)
    .pipe(plumber())
    .pipe(fileInclude())
    .pipe(gulp.dest(paths.dist))
    .pipe(server.stream());
}

// SCSS task
function styles() {
  return gulp.src(paths.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postCss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.distCss))
    .pipe(server.stream());
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
    .pipe(server.stream());
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
  gulp.watch(paths.scss, styles);
  gulp.watch(paths.js, scripts);
  gulp.watch(paths.images, images);
}

// Build task
const build = gulp.series(clean, gulp.parallel(html, styles, scripts, images));

// Default task
export default gulp.series(build, serve);
