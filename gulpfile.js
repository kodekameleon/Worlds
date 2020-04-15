/* eslint-disable no-undef */
const _ = require("lodash");
const path = require("path");
const gulp = require("gulp");
const gulp_eslint = require("gulp-eslint");
const spawn = require("cross-spawn");
const rimraf = require("rimraf");
const rollup = require("rollup");
const rollupBabel = require("rollup-plugin-babel");
const rollupResolve = require("@rollup/plugin-node-resolve");
const rollupCommonJS = require("@rollup/plugin-commonjs");
const rollupInject = require("@rollup/plugin-inject");
const rollupPostCSS = require("rollup-plugin-postcss");
const rollupCopy = require("rollup-plugin-copy");
const postcssAssets = require("postcss-assets");
const postcssPrecss = require("precss");
const postcssReporter = require("postcss-reporter");
const autoprefixer = require("autoprefixer");
const gulpStyleLint = require("gulp-stylelint");
/* eslint-enable no-undef */

const TARGET = "dist";


//  ======== PUBLIC TASKS ========

const build = gulp.series(lintJS, lintCSS, buildJS, buildDoc);

/* eslint-disable no-undef */
exports.build = build;
exports["clean-build"] = gulp.series(clean, build);
exports.start = gulp.series(clean, build, watch);
exports.clean = clean;
exports.makedoc = buildDoc;
/* eslint-enable no-undef */


//  ======== CLEAN ALL BUILD ARTIFACTS ========

function clean(cb) {
  rimraf(`{${TARGET},.nyc_output,coverage,doc}`, (err) => {
    if (err) {
      console.log(`rimraf error: ${err}`);
    }
    cb();
  });
}


//  ======== BUILD JS ========

function lintJS() {
  return gulp.src(["src/**/*.jsx", "src/**/*.js"])
    .pipe(gulp_eslint())
    .pipe(gulp_eslint.format(eslintFormatter))
    .pipe(gulp_eslint.failAfterError());
}

function buildJS() {
  return rollup.rollup({
    input: "src/main.jsx",
    external: [ "lodash" ],
    plugins: [
      rollupCopy({
        targets: [
          {src: "media/publish/**/*", dest: "dist"},
          {src: "src/main.html", dest: "dist", rename: "index.html"}
        ]
      }),
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
          ["@babel/plugin-transform-react-jsx", {
            "pragma": "createJSX",
            "pragmaFrag": "Fragment",
            "throwIfNamespace": false,
          }]
        ],
        exclude: ["node_modules/**"]
      }),
      rollupPostCSS({
        extract: true,
        sourceMap: true,
        plugins: [
          postcssPrecss(),
          autoprefixer(),
          postcssAssets({
            loadPaths: ["media/publish", "media/inline", "."],
            relative: "media/publish"
          }),
          postcssReporter({clearReportedMessages: true})
        ]
      }),
      rollupInject({
        include: "**/*.js*",
        exclude: "node_modules/**",
        modules: {
          createJSX: [path.resolve("src/kameleon-jsx"), "createJSX"],
          Fragment: [path.resolve("src/kameleon-jsx"), "Fragment"]
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

//  ======== START WEB SERVER AND WATCH FOR CHANGES ========

function watch() {
  spawn("reload", ["-b", "-d", TARGET]);
  gulp.watch("src/**/*", build);
}


//  ======== BUILD DOC ========
function buildDoc(cb) {
  spawn.sync("jsdoc", ["-r", "-c", "./.jsdoc.json", "-d", "./docs", "./src"]);
  cb();
}


//  ======== HELPERS ========
const sev = ["info", "warning", "error"];
const eslintFormatter = (results) => {
  const msgs = results.reduce((arr, v) => v.messages.length
    ? v.messages.reduce((a, m) => [...a, `${v.filePath}(${m.line}, ${m.column}): ${sev[m.severity]}: ${m.message}`], arr)
    : arr, []);
  return msgs.length === 0 ? undefined : "\n" + msgs.join("\n");
};

const styleLintFormatter = results => {
  const msgs = _.flatMap(results, result =>
    _.map(
      result.warnings,
      warning =>
        `${result.source}(${warning.line},${warning.column}): ${warning.severity}: ${warning.text}`
    )
  );
  return msgs.length === 0 ? "" : "\n" + msgs.joing("\n");
}
