
/* eslint-disable no-undef */
const path = require("path");
const rollupBabel = require("rollup-plugin-babel");
const rollupResolve = require("rollup-plugin-node-resolve");
const rollupCommonJS = require("rollup-plugin-commonjs");
const rollupInject = require("rollup-plugin-inject");
/* eslint-enable no-undef */

export default {
  input: "src/main.jsx",
  output: {
    file: "main.js",
    format: "es",
    name: "MyModule"
  },
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
      browser: true,  // Default: false
      extensions: [".mjs", ".js", ".jsx", ".json"],
      preferBuiltins: false,  // Default: true
      // modulesOnly: true, // Default: false
      mainFields: ["module", "main"]
    }),
    rollupCommonJS({
      include: "node_modules/**",
      // exclude: [ ],
      // ignoreGlobal: false, // if true then uses of `global` won't be dealt with by this plugin
      // sourceMap: false // if false then skip sourceMap generation for CommonJS modules
    })
  ]
};
