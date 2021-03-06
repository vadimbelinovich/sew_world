"use strict";

const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const del = require("del");
const panini = require("panini");
const browsersync = require("browser-sync").create();

/* Paths */
var path = {
  build: {
    html: "dist/",
    css: "dist/assets/css/",
    images: "dist/assets/img/",
    favicon: "dist/",
    fonts: "dist/assets/fonts/",
  },
  src: {
    html: "src/*.html",
    css: "src/assets/sass/style.scss",
    images: "src/assets/img/**/*.{jpg,png,svg,gif,ico,webp}",
    favicon: "src/assets/img/favicon/favicon.ico",
    fonts: "src/assets/fonts/**/*.*",
  },
  watch: {
    html: "src/**/*.html",
    css: "src/assets/sass/**/*.scss",
    images: "src/assets/img/**/*.{jpg,png,svg,gif,ico,webp}",
    favicon: "src/assets/img/favicon/favicon.ico",
    fonts: "src/assets/fonts/**/*.*",
  },
  clean: "./dist",
};

/* Tasks */
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./dist/",
    },
    port: 3000,
    notify: false,
  });
}

function browserSyncReload(done) {
  browsersync.reload();
}

function html() {
  panini.refresh();
  return src(path.src.html, { base: "src/" })
    .pipe(plumber())
    .pipe(
      panini({
        root: "src/",
        layouts: "src/tpl/layouts/",
        partials: "src/tpl/partials/",
        helpers: "src/tpl/helpers/",
        data: "src/tpl/data/",
      })
    )
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css, { base: "src/assets/sass/" })
    .pipe(plumber())
    .pipe(sass())
    .pipe(
      autoprefixer({
        Browserslist: ["last 10 versions"],
        cascade: true,
      })
    )
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(
      cssnano({
        zindex: false,
        discardComments: {
          removeAll: true,
        },
      })
    )
    .pipe(removeComments())
    .pipe(
      rename({
        suffix: ".min",
        extname: ".css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function images() {
  return src(path.src.images).pipe(dest(path.build.images));
}

function favicon() {
  return src(path.src.favicon).pipe(imagemin()).pipe(dest(path.build.favicon));
}

function fonts() {
  return src(path.src.fonts).pipe(dest(path.build.fonts));
}

function clean() {
  return del(path.clean);
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.fonts], fonts);
  gulp.watch([path.watch.favicon], favicon);
}

const build = gulp.series(
  clean,
  gulp.parallel(html, css, images, fonts, favicon)
);
const watch = gulp.parallel(build, watchFiles, browserSync);

/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.images = images;
exports.fonts = fonts;
exports.favicon = favicon;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
