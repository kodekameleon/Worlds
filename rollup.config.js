import assets from "postcss-assets";
import autoprefixer from "autoprefixer";
import {babel} from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import {eslint} from "rollup-plugin-eslint";
import gitParse from "parse-git-config";
import gitPath from "git-config-path";
import inject from "@rollup/plugin-inject";
import path from "path";
import postcss from "rollup-plugin-postcss";
import precss from "precss";
import process from "process";
import replace from "@rollup/plugin-replace";
import reporter from "postcss-reporter";
import resolve from "@rollup/plugin-node-resolve";

// Format lint messages so we can click on them
const sev = ["info", "warning", "error"];
const eslintFormatter = (results) => {
  const msgs = results.reduce((arr, v) => v.messages.length
    ? v.messages.reduce((a, m) => [...a, `${v.filePath}(${m.line}, ${m.column}): ${sev[m.severity]}: ${m.message}`], arr)
    : arr, []);
  return msgs.length === 0 ? undefined : "\n" + msgs.join("\n");
};

// Determine the developer environment
let gitUser;
if (!process.env.CI) {
  let gitConfig = gitParse.sync({path: gitPath()}) || {};
  if (!gitConfig.user || !gitConfig.user.name) {
    gitConfig = gitParse.sync({path: gitPath("global")}) || {};
  }
  gitUser = gitConfig.user.name;
}

// Rollup plugin that will conditionally ignore files that are imported
function ignoreDevPlugin(args) {
  const importId = "\0ignore-dev-plugin";
  const {ignore, imports} = args;
  return {
    resolveId(importee, importer) {
      if (ignore && importer && importee.includes("/") && imports.includes(path.resolve(importer, "..", importee))) {
        return importId;
      }
      return null;
    },
    load(id) {
      return ignore && id === importId ? "export default {}" : null;
    },
  };
}

export default {
  input: "src/main.jsx",
  output: {
    file: "dist/main.js",
    format: "iife",
    globals: {lodash: "_"},
    sourcemap: true
  },
  external: [ "lodash"],
  plugins: [
    replace({
      include: "**/devenv*",
      delimiters: ["", ""],
      "$$PROFILE$$": gitUser,
    }),
    ignoreDevPlugin({ignore: !!process.env.CI, imports: [path.resolve("./devenv")]}),
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
