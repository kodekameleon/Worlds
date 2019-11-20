/* eslint-disable no-undef */
const _ = require("lodash");
const path = require("path");
const gulp = require("gulp");
const gulp_rename = require("gulp-rename");
const gulp_postcss = require("gulp-postcss");
const gulp_sourcemaps = require("gulp-sourcemaps");
const gulp_eslint = require("gulp-eslint");
const pump = require("pump");
const spawn = require("cross-spawn");
const rimraf = require("rimraf");
const rollup = require("rollup");
const rollupBabel = require("rollup-plugin-babel");
const rollupResolve = require("rollup-plugin-node-resolve");
const rollupCommonJS = require("rollup-plugin-commonjs");
const rollupInject = require("rollup-plugin-inject");
const postcssAssets = require("postcss-assets");
const postcssImport = require("postcss-import");
const postcssPrecss = require("precss");
const postcssReporter = require("postcss-reporter");
const autoprefixer = require("autoprefixer");
const gulpStyleLint = require("gulp-stylelint");
/* eslint-enable no-undef */

const TARGET = "dist";


//  ======== PUBLIC TASKS ========

const build = gulp.series(buildHtml, lintJS, buildJS, lintCSS, buildCSS);

/* eslint-disable no-undef */
exports.build = build;
exports["clean-build"] = gulp.series(clean, build);
exports.start = gulp.series(clean, build, watch);
exports.clean = clean;
/* eslint-enable no-undef */


//  ======== CLEAN ALL BUILD ARTIFACTS ========

function clean(cb) {
  rimraf(`{${TARGET},.nyc_output,coverage}`, (err) => {
    if (err) {
      console.log(`rimraf error: ${err}`);
    }
    cb();
  });
}


//  ======== BUILD HTML ========

function buildHtml(cb) {
  const steps = [
    gulp.src("src/main.html"),
    gulp_rename("index.html"),
    gulp.dest(TARGET)
  ];
  pump(steps, cb);
}


//  ======== BUILD JS ========

function lintJS(cb) {
  const steps = [
    gulp.src(["src/**/*.jsx", "src/**/*.js"]),
    gulp_eslint(),
    gulp_eslint.formatEach("visualstudio"),
    gulp_eslint.failAfterError()
  ];
  pump(steps, cb);
}

function buildJS() {
  return rollup.rollup({
    input: "src/main.jsx",
    external: [ "lodash" ],
    plugins: [
      rollupCommonJS({
        include: "node_modules/**"
      }),
      rollupResolve({
        browser: true,  // Default: false
        extensions: [".mjs", ".js", ".jsx", ".json"],
        preferBuiltins: false,
        mainFields: ["module", "main"]
      }),
      rollupBabel({
        presets: [
          ["@babel/preset-env", {modules: false}]
        ],
        plugins: [
          ["@babel/plugin-transform-react-jsx", {"pragma": "createJSX", "throwIfNamespace": false}]
        ],
        exclude: ["node_modules/**"]
      }),
      rollupInject({
        include: "**/*.js*",
        exclude: "node_modules/**",
        modules: {
          createJSX: [path.resolve("src/kameleon-jsx"), "createJSX"]
        }
      })
    ]
  }).then((bundler) => {
    return bundler.write({
      file: `${TARGET}/main.js`,
      format: "iife",
      sourcemap: true,
      globals: {lodash: "_"}
    });
  });
}


//  ======== BUILD CSS ========

function lintCSS() {
  return gulp.src(["src/**/*.css"])
    .pipe(gulpStyleLint({
      failAfterError: true,
      reporters: [{formatter: styleLintFormatter, console: true}]
    }));
}

function buildCSS(cb) {
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
    gulp.dest(TARGET)
  ];
  pump(steps, cb);
}


//  ======== START WEB SERVER AND WATCH FOR CHANGES ========

function watch() {
  spawn("reload", ["-b", "-d", TARGET]);
  gulp.watch("src/**/*", build);
}


//  ======== Helpers ========

const styleLintFormatter = results =>
  _.flatMap(results, result =>
    _.map(
      result.warnings,
      warning =>
        `${result.source}(${warning.line},${warning.column}): ${warning.severity}: ${warning.text}`
    )
  ).join("\n");
