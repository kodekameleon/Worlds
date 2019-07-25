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
const rollup_babel = require("rollup-plugin-babel");
const rollup_resolve = require("rollup-plugin-node-resolve");
const postcss_assets = require("postcss-assets");
const postcss_import = require("postcss-import");

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
  rimraf(target, (err) => {
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

gulp.task("lint", (cb) => {
  const steps = [
    gulp.src(["src/**/*.jsx", "src/**/*.js"]),
    gulp_eslint(),
    gulp_eslint.format("visualstudio"),
    gulp_eslint.failAfterError()
  ];
  pump(steps, cb);
});

gulp.task("build-js", ["lint"], () => {
  return rollup.rollup({
    input: "src/main.jsx",
    plugins: [
      rollup_resolve({
        module: true, // Default: true
        browser: true,  // Default: false
        extensions: [".mjs", ".js", ".jsx", ".json"],
        preferBuiltins: false,  // Default: true
        modulesOnly: true, // Default: false
        customResolveOptions: {
          moduleDirectory: "js_modules"
        }

        // Lock the module search in this path (like a chroot). Module defined
        // outside this path will be marked as external
        // jail: '/my/jail/path', // Default: '/'

        // Set to an array of strings and/or regexps to lock the module search
        // to modules that match at least one entry. Modules not matching any
        // entry will be marked as external
        // only: ['some_module', /^@some_scope\/.*$/], // Default: null
      }),
      rollup_babel({
        presets: [
          ["env", {modules: false}]
        ],
        plugins: [
          ["transform-react-jsx", {"pragma": "minjsx"}],
          "external-helpers"
        ]
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

gulp.task("build-css", (cb) => {
  const steps = [
    gulp.src("./src/main.css", {base: "./"}),
    gulp_sourcemaps.init(),
    gulp_postcss([
      postcss_import({from: "./src/main.css"}),
      postcss_assets({
        loadPaths: ["media", "."]
      })
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


// var gulp = require('gulp');
// var gulp_if = require('gulp-if');
// var gulp_concat = require('gulp-concat');
// var gulp_rename = require('gulp-rename');
// var gulp_uglify = require('gulp-uglify');
// var gulp_sourcemaps = require('gulp-sourcemaps');
// var gulp_print = require('gulp-print');
// var gulp_sass = require('gulp-sass');
// var gulp_inject = require('gulp-inject');
// var gulp_flatten = require('gulp-flatten');
// var gulp_replace = require('gulp-replace');
// var gulp_htmlmin = require('gulp-htmlmin');
// var gulp_copy = require('gulp-copy');
// var pump = require('pump');
// var fs_extra = require('fs-extra');
// var streamqueue = require('streamqueue');
//
// var task_chain = [];
//
// process.chdir('C:\\Dev\\svn\\platform\\branches\\4-iam\\platform\\dbcore');
//
// gulp.task('compile-javascript', function (cb) {
//     var steps = [
//         streamqueue(
//             { objectMode: true },
//             gulp.src(
//                 [
//                     "src/main/javascript/3rd-party/jquery.js",
//                     "src/main/javascript/3rd-party/**/*.js",
//                 ],
//                 {"base": "src/main/javascript"}
//             ),
//             gulp.src(
//                 [
//                     "../lib/src/main/javascript/lib/**/*.js",
//                 ],
//                 {"base": "../lib/src/main/javascript"}
//             ),
//             gulp.src(
//                 [
//                     "src/main/javascript/**/*.js",
//                     "!src/main/javascript/3rd-party/**/*.js",
//                 ],
//                 {"base": "src/main/javascript"}
//             )
//         ),
//         gulp_print(),
//         gulp_sourcemaps.init(),
//         gulp_if("true"!=="true", gulp_uglify()),
//         gulp_concat("dbcore.js"),
//         gulp_if("true"==="true", gulp_sourcemaps.write('.')),
//         gulp.dest("target/dbcore")
//     ];
//     pump(steps, cb);
// });
// task_chain.push('compile-javascript');
//
// gulp.task('compile-sass', function (cb) {
//     var steps = [
//         streamqueue(
//             { objectMode: true },
//             gulp.src(
//                 [
//                     "src/main/javascript/main.scss",
//                     "src/main/javascript/3rd-party/**/*.*css",
//                 ],
//                 {"base": "src/main/javascript"}
//             ),
//             gulp.src(
//                 [
//                     "../lib/src/main/javascript/lib/**/*.scss",
//                     "!../lib/src/main/javascript/lib/**/*.mixin.*css",
//                 ],
//                 {"base": "../lib/src/main/javascript"}
//             ),
//             gulp.src(
//                 [
//                     "src/main/javascript/**/*.scss",
//                     "!src/main/javascript/main.scss",
//                     "!src/main/javascript/3rd-party/**/*.*css",
//                     "!src/main/javascript/**/*.mixin.*css",
//                 ],
//                 {"base": "src/main/javascript"}
//             )
//         ),
//         gulp_print(),
//         gulp_sourcemaps.init(),
//         gulp_sass({ includePaths: [
//                 'src/main/javascript/mixins',
//                 '.',
//                 '../lib/src/main/javascript/lib',
//                 '../lib/src/main/javascript/lib/mixins',
//             ]}),
//         gulp_concat("dbcore.css"),
//         gulp_if("true"!=="true", gulp_uglify()),
//         gulp_if("true"==="true", gulp_sourcemaps.write('.')),
//         gulp.dest("target/dbcore")
//     ];
//     pump(steps, cb);
// });
// task_chain.push('compile-sass');
//
// gulp.task('compile-html', function (cb) {
//     var steps = [
//         gulp.src("src/main/javascript/main.html", {base: "src/main/javascript"}),
//         gulp_print(function(path) { return 'injecting ' + path; }),
//         gulp_replace('$'+'{project.name}', 'dbcore'),
//         gulp_replace('$'+'{page.title}', 'Racemi CMDB Management'),
//         gulp_inject(
//             streamqueue(
//                 { objectMode: true },
//                 gulp.src(
//                     [
//                         "../lib/src/main/javascript/lib/**/*.hbs",
//                     ],
//                     {"base": "../lib/src/main/javascript"}
//                 ),
//                 gulp.src(
//                     [
//                         "src/main/javascript/**/*.hbs",
//                     ],
//                     {"base": "src/main/javascript"}
//                 )
//             )
//                 .pipe(gulp_print(function(path) { return 'injecting ' + path; }))
//                 .pipe(gulp_htmlmin({collapseWhitespace: true, processScripts: ["text/x-handlebars-template"]})),
//             {
//                 starttag: '<!-- inject:html -->',
//                 transform: function (filePath, file) {
//                     return file.contents.toString('utf8')
//                 }
//             }
//         ),
//         gulp_flatten(),
//         gulp_rename("dbcore.html"),
//         gulp.dest("target/dbcore")
//     ];
//     pump(steps, cb);
// });
// task_chain.push('compile-html');
//
// gulp.task('default', task_chain);
