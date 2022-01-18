import gulp from "gulp";
import plumber from "gulp-plumber";
import less from "gulp-less";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import csso from "postcss-csso";
import rename from "gulp-rename";
import htmlmin from "gulp-htmlmin";
import terser from "gulp-terser";
import squoosh from "gulp-libsquoosh";
import svgo from "gulp-svgmin";
import svgstore from "gulp-svgstore";
import replace from "gulp-replace";
import del from "del";
import browser from "browser-sync";

let date = new Date();

// Styles CSS
export const styles = () => {
  return gulp
    .src("source/less/style.less", { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

const stylesBuild = () => {
  return gulp
    .src("source/less/style.less")
    .pipe(less())
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(browser.stream());
};

// HTML
const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(gulp.dest("build"));
};

const htmlBuild = () => {
  return gulp
    .src("source/*.html")
    .pipe(
      replace(
        "?v=cache",
        `?v=${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}`
      )
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
};

// Scripts
const scripts = () => {
  return gulp
    .src("source/js/*.js")
    .pipe(
      rename(function (path) {
        path.basename += ".min";
        path.extname = ".js";
      })
    )
    .pipe(gulp.dest("build/js"))
    .pipe(browser.stream());
};

const scriptsBuild = () => {
  return gulp
    .src("source/js/*.js")
    .pipe(terser())
    .pipe(
      rename(function (path) {
        path.basename += ".min";
        path.extname = ".js";
      })
    )
    .pipe(gulp.dest("build/js"))
    .pipe(browser.stream());
};

// Images
const optimizeImages = () => {
  return gulp
    .src("source/img/**/*.{png,jpg}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img"));
};

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg}").pipe(gulp.dest("build/img"));
};

// WebP
const createWebp = () => {
  return gulp
    .src(["source/img/**/*.{png,jpg}", "!source/img/favicons/*.png"])
    .pipe(
      squoosh({
        webp: {},
      })
    )
    .pipe(gulp.dest("build/img"));
};

// SVG
const svg = () =>
  gulp
    .src(["source/img/**/*.svg", "!source/img/sprite/*.svg"])
    .pipe(svgo())
    .pipe(gulp.dest("build/img"));

const sprite = () => {
  return gulp
    .src("source/img/sprite/*.svg")
    .pipe(svgo())
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(replace(`<g fill="none">`, "<g>"))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

// Copy
const copy = (done) => {
  gulp
    .src(
      ["source/fonts/*.{woff2,woff}", "source/*.ico", "source/*.webmanifest"],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
  done();
};

// Clean
const clean = () => {
  return del("build");
};

// Server
const server = (done) => {
  browser.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Reload
const reload = (done) => {
  browser.reload();
  done();
};

// Watcher
const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles));
  gulp.watch("source/js/*.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, reload));
};

// Build
export const build = gulp.series(
  clean,
  copy,
  gulp.parallel(
    htmlBuild,
    scriptsBuild,
    stylesBuild,
    svg,
    sprite,
    optimizeImages,
    createWebp
  ),
  gulp.series(server, watcher)
);

// Default
export default gulp.series(
  clean,
  copy,
  gulp.parallel(html, scripts, styles, svg, sprite, copyImages, createWebp),
  gulp.series(server, watcher)
);
