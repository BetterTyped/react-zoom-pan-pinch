/**
 * Ships the library CSS as `dist/styles.css` (#403, #371).
 *
 * rollup-plugin-postcss runs with `inject: false`, so the bundle no longer
 * appends a `<style>` to `document.head` when it loads (blocked by a CSP
 * without `'unsafe-inline'`, and invisible inside a shadow root). The CSS
 * string is exported as `stylesheet` and `TransformComponent` injects it into
 * the wrapper's own root, with an optional nonce. For a CSP that allows no
 * inline `<style>` at all, this plugin also writes the same CSS to a file the
 * app can link or import (`react-zoom-pan-pinch/dist/styles.css`) together
 * with `disableStyleInjection`.
 */

// postcss emits `export var stylesheet=<JSON string>;` for each CSS module.
const STYLESHEET_EXPORT = /export var stylesheet=("(?:[^"\\]|\\.)*");/;

/**
 * @param {string} code module code produced by rollup-plugin-postcss
 * @returns {string | null} the CSS of that module
 */
function readStylesheetExport(code) {
  const match = code.match(STYLESHEET_EXPORT);
  return match ? JSON.parse(match[1]) : null;
}

/**
 * Must run after the postcss plugin: it reads the transformed modules.
 *
 * @param {{ fileName?: string }} [options]
 */
function stylesheetAssetPlugin({ fileName = "styles.css" } = {}) {
  /** @type {Map<string, string>} */
  const sheets = new Map();

  return {
    name: "rzpp-stylesheet-asset",
    transform(code, id) {
      if (!id.endsWith(".css")) return null;
      const css = readStylesheetExport(code);
      if (css !== null) sheets.set(id, css);
      return null;
    },
    generateBundle() {
      const source = [...sheets.keys()]
        .sort()
        .map((id) => sheets.get(id))
        .join("\n");
      this.emitFile({ type: "asset", fileName, source });
    },
  };
}

module.exports = { readStylesheetExport, stylesheetAssetPlugin };
