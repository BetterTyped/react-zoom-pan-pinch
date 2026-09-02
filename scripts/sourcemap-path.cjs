/**
 * Source-map hygiene for the published package (#529, #542).
 *
 * The npm package ships `dist/` and `src/` side by side. Consumers' bundlers
 * (webpack's source-map-loader, Vite, Next) read `dist/*.map` and, for every
 * source that has no embedded `sourcesContent`, try to open the file at the
 * listed path. Two things made that fail and produce a wall of
 * "Failed to parse source map … ENOENT" warnings:
 *
 * 1. Rollup + @rollup/plugin-typescript listed sources as `../../src/x.ts`,
 *    one level too deep for a map that lives in `dist/`, so bundlers looked
 *    for `node_modules/src/x.ts`.
 * 2. `sourcesContent` was empty for every TypeScript source, so the path was
 *    actually needed.
 */
const fs = require("fs");
const path = require("path");

/**
 * @param {string} relativeSourcePath path as emitted by rollup
 * @returns {string} path relative to `dist/`, e.g. `../src/x.ts`
 */
function toDistRelativeSourcePath(relativeSourcePath) {
  const normalized = relativeSourcePath.replace(/\\/g, "/");
  const match = normalized.match(/(?:^|\/)src\/(.*)$/);
  if (!match) return relativeSourcePath;
  return `../src/${match[1]}`;
}

/**
 * Fills missing `sourcesContent` entries of a parsed source map by reading
 * the files relative to the directory the map is written to.
 *
 * @param {{ sources: string[]; sourcesContent?: (string | null)[] }} map
 * @param {string} mapDir absolute directory the map file lives in
 * @param {(file: string) => string | null} [readFile]
 * @returns {{ filled: number; missing: string[] }}
 */
function embedSourcesContent(map, mapDir, readFile = readFileIfExists) {
  // One entry per source; anything falsy (missing, null, undefined, "")
  // counts as absent so a short or sparse array is handled the same way.
  const contents = map.sources.map(
    (_, index) => (map.sourcesContent && map.sourcesContent[index]) || null,
  );
  const missing = [];
  let filled = 0;

  map.sources.forEach((source, index) => {
    if (contents[index]) return;
    const content = readFile(path.resolve(mapDir, source));
    if (content === null) {
      missing.push(source);
      return;
    }
    contents[index] = content;
    filled += 1;
  });

  // eslint-disable-next-line no-param-reassign
  map.sourcesContent = contents;
  return { filled, missing };
}

function readFileIfExists(file) {
  try {
    return fs.readFileSync(file, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Rollup plugin: post-processes every emitted `.map` asset so each source has
 * its content embedded. Fails the build if a source cannot be read, because
 * that is precisely the situation that produces consumer warnings.
 *
 * @returns {import("rollup").Plugin}
 */
function embedSourcesContentPlugin() {
  return {
    name: "embed-sources-content",
    generateBundle(outputOptions, bundle) {
      const mapDir = path.dirname(path.resolve(outputOptions.file));
      Object.values(bundle).forEach((asset) => {
        if (asset.type !== "asset" || !asset.fileName.endsWith(".map")) return;
        const map = JSON.parse(String(asset.source));
        const { missing } = embedSourcesContent(map, mapDir);
        if (missing.length) {
          throw new Error(
            `Source map ${asset.fileName} references sources that cannot be read: ${missing.join(", ")}`,
          );
        }
        // eslint-disable-next-line no-param-reassign
        asset.source = JSON.stringify(map);
      });
    },
  };
}

module.exports = {
  toDistRelativeSourcePath,
  embedSourcesContent,
  embedSourcesContentPlugin,
};
