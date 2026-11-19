import babel from "@rollup/plugin-babel";
import external from "rollup-plugin-peer-deps-external";
import del from "rollup-plugin-delete";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import pkg from "./package.json" with { type: "json" };
import {
  toDistRelativeSourcePath,
  embedSourcesContentPlugin,
} from "./scripts/sourcemap-path.cjs";
import { stylesheetAssetPlugin } from "./scripts/stylesheet-asset.cjs";

export default [
  {
    input: pkg.source,
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        sourcemap: true,
        sourcemapPathTransform: toDistRelativeSourcePath,
      },
      {
        file: pkg.module,
        format: "es",
        exports: "named",
        sourcemap: true,
        sourcemapPathTransform: toDistRelativeSourcePath,
      },
    ],
    plugins: [
      external(),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
      del({ targets: ["dist/*"] }),
      typescript({ declaration: false }),
      // No `<style>` at module load (#403 CSP, #371 shadow DOM):
      // TransformComponent injects the exported `stylesheet` into the
      // wrapper's root, and `dist/styles.css` ships the same CSS.
      postcss({
        modules: true,
        inject: false,
      }),
      stylesheetAssetPlugin(),
      embedSourcesContentPlugin(),
    ],
    onwarn(error, warn) {
      if (error.code !== "CIRCULAR_DEPENDENCY") {
        warn(error);
      }
    },
    external: Object.keys(pkg.peerDependencies || {}),
  },
  {
    input: pkg.source,
    output: [{ file: pkg.types, format: "es" }],
    plugins: [
      external(),
      dts({
        compilerOptions: {
          baseUrl: "./src",
        },
      }),
    ],
  },
];
