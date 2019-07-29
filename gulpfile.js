/* eslint-disable no-undef */
const _ = require("lodash");
const path = require("path");
const gulp = require("gulp");
const gulp_rename = require("gulp-rename");
const gulp_postcss = require("gulp-postcss");
const gulp_sourcemaps = require("gulp-sourcemaps");
const gulp_eslint = require("gulp-eslint");
const pump = require("pump");
const sequence = require("run-sequence");
const spawn = require("cross-spawn");
const rimraf = require("rimraf");
const rollup = require("rollup");
const rollupBabel = require("rollup-plugin-babel");
const rollupResolve = require("rollup-plugin-node-resolve");
const rollupInject = require("rollup-plugin-inject");
const postcssAssets = require("postcss-assets");
const postcssImport = require("postcss-import");
const postcssPrecss = require("precss");
const postcssReporter = require("postcss-reporter");
const autoprefixer = require("autoprefixer");
const gulpStyleLint = require("gulp-stylelint");
/* eslint-enable no-undef */

const target = "dist";

gulp.task("default", ["clean-build"]);
gulp.task("build", ["build-html", "build-js", "build-css"]);


//  ======== CLEAN AND BUILD EVERYTHING ========

gulp.task("clean-build", (cb) => {
  sequence("clean", "build", cb);
});


//  ======== BUILD EVERYTHING AND RUN IT ========

gulp.task("start", (cb) => {
  sequence("clean", "build", "watch", cb);
});


//  ======== CLEAN ALL BUILD ARTIFACTS ========

gulp.task("clean", (cb) => {
  rimraf(`{${target},.nyc_output,coverage}`, (err) => {
    if (err) {
      console.log(`rimraf error: ${err}`);
    }
    cb();
  });
});


//  ======== BUILD HTML ========

gulp.task("build-html", (cb) => {
  const steps = [
    gulp.src("src/main.html"),
    gulp_rename("index.html"),
    gulp.dest(target)
  ];
  pump(steps, cb);
});


//  ======== BUILD JS ========

gulp.task("lint-js", (cb) => {
  const steps = [
    gulp.src(["src/**/*.jsx", "src/**/*.js"]),
    gulp_eslint(),
    gulp_eslint.formatEach("visualstudio"),
    gulp_eslint.failAfterError()
  ];
  pump(steps, cb);
});

gulp.task("build-js", ["lint-js"], () => {
  return rollup.rollup({
    input: "src/main.jsx",
    plugins: [
      rollupBabel({
        presets: [
          ["env", {modules: false}]
        ],
        plugins: [
          ["transform-react-jsx", {"pragma": "minjsx"}],
          "external-helpers"
        ]
      }),
      rollupInject({
        include: "**/*.js*",
        exclude: "node_modules/**",
        modules: {
          minjsx: [path.resolve("src/minjsx/minjsx"), "minjsx"]
        }
      }),
      rollupResolve({
        module: true, // Default: true
        browser: true,  // Default: false
        extensions: [".mjs", ".js", ".jsx", ".json"],
        preferBuiltins: false,  // Default: true
        modulesOnly: true, // Default: false
        customResolveOptions: {
          moduleDirectory: "node_modules"
        }
      })
    ]
  }).then((bundler) => {
    return bundler.write({
      file: "dist/main.js",
      format: "es",
      sourcemap: true
    });
  });
});


//  ======== BUILD CSS ========

gulp.task("lint-css", () => {
  return gulp.src(["src/**/*.css"])
    .pipe(gulpStyleLint({
      failAfterError: true,
      reporters: [{formatter: styleLintFormatter, console: true}]
    }));
});

gulp.task("build-css", ["lint-css"], (cb) => {
  const steps = [
    gulp.src(["./src/main.css"], {base: "./"}),
    gulp_sourcemaps.init(),
    gulp_postcss([
      postcssImport({from: "./src/main.css"}),
      postcssPrecss(),
      autoprefixer(),
      postcssAssets({
        loadPaths: ["media", "."]
      }),
      postcssReporter({clearReportedMessages: true})
    ]),
    gulp_rename("main.css"),
    gulp_sourcemaps.write("."),
    gulp.dest(target)
  ];
  pump(steps, cb);
});


//  ======== START WEB SERVER AND WATCH FOR CHANGES ========

gulp.task("watch", () => {
  spawn("reload", ["-b", "-d", "dist"]);
  gulp.watch("src/**/*", ["build"]);
});


//  ======== Helpers ========

const styleLintFormatter = results =>
  _.flatMap(results, result =>
    _.map(
      result.warnings,
      warning =>
        `${result.source}(${warning.line},${warning.column}): ${warning.severity}: ${warning.text}`
    )
  ).join("\n");
