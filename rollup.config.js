import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json";

export default defineConfig([
  {
    input: pkg.source,
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: "es",
        exports: "named",
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      babel({
        exclude: "node_modules/**",
      }),
      del({
        targets: ["dist/*"],
      }),
      typescript(),
      postcss({
        modules: true,
      }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
  },
  {
    input: pkg.source,
    output: [
      {
        file: pkg.types,
        format: "es",
      },
    ],
    plugins: [
      external(),
      dts({
        compilerOptions: {
          baseUrl: "./src",
        },
      }),
    ],
  },
]);
