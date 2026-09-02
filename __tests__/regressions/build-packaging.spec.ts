/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from "fs";
import * as path from "path";

const {
  toDistRelativeSourcePath,
  embedSourcesContent,
} = require("../../scripts/sourcemap-path.cjs");

const root = path.resolve(__dirname, "../..");
const distDir = path.join(root, "dist");
const maps = ["index.cjs.js.map", "index.esm.js.map"].map((name) =>
  path.join(distDir, name),
);
const hasBuild = maps.every((file) => fs.existsSync(file));
// CI builds before it tests, so a missing build there is a real failure.
const withBuild = hasBuild || process.env.CI ? it : it.skip;

type SourceMap = { sources: string[]; sourcesContent?: (string | null)[] };

describe("build and packaging regressions", () => {
  it("package.json files field includes src/ for source map resolution (Ref #529)", () => {
    const pkgPath = path.resolve(__dirname, "../../package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const files: string[] = pkg.files || [];
    const includesSrc = files.some(
      (f: string) => f === "src" || f.startsWith("src/"),
    );
    expect(includesSrc).toBe(true);
  });

  describe("source map paths (Ref #529, #542)", () => {
    it("rewrites rollup's too-deep relative paths to the shipped src folder", () => {
      expect(
        toDistRelativeSourcePath(
          "../../src/components/keep-scale/keep-scale.tsx",
        ),
      ).toBe("../src/components/keep-scale/keep-scale.tsx");
      expect(toDistRelativeSourcePath("../src/index.ts")).toBe(
        "../src/index.ts",
      );
      expect(toDistRelativeSourcePath("src/utils/a.ts")).toBe(
        "../src/utils/a.ts",
      );
      expect(toDistRelativeSourcePath("..\\..\\src\\core\\x.ts")).toBe(
        "../src/core/x.ts",
      );
    });

    it("leaves paths that are not under src untouched", () => {
      expect(
        toDistRelativeSourcePath("../node_modules/tslib/tslib.es6.js"),
      ).toBe("../node_modules/tslib/tslib.es6.js");
    });
  });

  describe("embedded sources (Ref #529, #542)", () => {
    it("fills only the missing sourcesContent entries and reports unreadable ones", () => {
      const map: SourceMap = {
        sources: ["../src/a.ts", "../src/b.ts", "../node_modules/x.js"],
        sourcesContent: ["already here", null, undefined as unknown as null],
      };
      const files: Record<string, string> = {
        [path.resolve("/pkg/dist", "../src/b.ts")]: "b source",
      };

      const result = embedSourcesContent(
        map,
        "/pkg/dist",
        (file: string) => files[file] ?? null,
      );

      expect(map.sourcesContent).toEqual(["already here", "b source", null]);
      expect(result).toEqual({
        filled: 1,
        missing: ["../node_modules/x.js"],
      });
    });

    it("creates the sourcesContent array when the map has none", () => {
      const map: SourceMap = { sources: ["../src/a.ts"] };
      embedSourcesContent(map, "/pkg/dist", () => "a source");
      expect(map.sourcesContent).toEqual(["a source"]);
    });

    withBuild(
      "every source in the built maps has embedded content and src paths resolve",
      () => {
        maps.forEach((mapFile) => {
          const map = JSON.parse(
            fs.readFileSync(mapFile, "utf-8"),
          ) as SourceMap;
          expect(map.sources.length).toBeGreaterThan(0);
          expect(map.sourcesContent).toHaveLength(map.sources.length);

          map.sources.forEach((source, index) => {
            // Bundlers only hit the disk when the content is missing, so a
            // populated entry is what keeps consumers warning-free.
            expect(typeof map.sourcesContent![index]).toBe("string");
            expect(map.sourcesContent![index]!.length).toBeGreaterThan(0);

            if (!source.includes("node_modules")) {
              // The package is `dist/` + `src/` side by side: the only valid
              // prefix is one level up (4.0.7 shipped `../../src/`).
              expect(source.startsWith("../src/")).toBe(true);
              expect(fs.existsSync(path.resolve(distDir, source))).toBe(true);
            }
          });
        });
      },
    );
  });
});
