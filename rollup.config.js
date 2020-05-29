import assets from "postcss-assets";
import autoprefixer from "autoprefixer";
import {babel} from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import {eslint} from "rollup-plugin-eslint";
import inject from "@rollup/plugin-inject";
import path from "path";
import postcss from "rollup-plugin-postcss";
import precss from "precss";
import reporter from "postcss-reporter";
import resolve from "@rollup/plugin-node-resolve";

const sev = ["info", "warning", "error"];
const eslintFormatter = (results) => {
  const msgs = results.reduce((arr, v) => v.messages.length
    ? v.messages.reduce((a, m) => [...a, `${v.filePath}(${m.line}, ${m.column}): xxxxx ${sev[m.severity]}: ${m.message}`], arr)
    : arr, []);
  return msgs.length === 0 ? undefined : "\n" + msgs.join("\n");
};

export default {
  input: "src/main.jsx",
  output: {
    file: "dist/main.js",
    format: "iife",
    globals: {lodash: "_"},
    sourcemap: true
  },
  external: [ "lodash" ],
  plugins: [
    postcss({
      extract: true,
      sourceMap: true,
      plugins: [
        precss(),
        autoprefixer(),
        assets({
          loadPaths: ["media/publish", "media/inline", "."],
          relative: "media/publish"
        }),
        reporter({clearReportedMessages: true})
      ]
    }),
    eslint({
      formatter: eslintFormatter,
      throwOnError: true,
      throwOnWarning: true
    }),
    commonjs({
      include: "node_modules/**"
    }),
    resolve({
      browser: true,
      extensions: [".js", ".jsx", ".json"],
      preferBuiltins: false,
      mainFields: ["module", "main"]
    }),
    babel({
      babelHelpers: "bundled"
    }),
    inject({
      include: "**/*.js*",
      exclude: "node_modules/**",
      modules: {
        createJSX: [path.resolve("src/kameleon-jsx"), "createJSX"],
        Fragment: [path.resolve("src/kameleon-jsx"), "Fragment"]
      }
    }),
    copy({
      targets: [
        {src: "media/publish/**/*", dest: "dist"},
        {src: "src/main.html", dest: "dist", rename: "index.html"}
      ]
    })
  ]
};
