import { StateType } from "models";

/** Drop binary float noise on scale (e.g. 1.5000000000000002) without clipping real zoom values. */
export const roundScaleForTransform = (scale: number): number =>
  Number.parseFloat(scale.toFixed(8));

const STYLE_MARKER = "data-react-zoom-pan-pinch";

/**
 * Adds the library stylesheet once per root the wrapper renders into: the
 * document `<head>`, or the shadow root itself (#371), where a stylesheet in
 * the head never applies. `nonce` is set on the `<style>` so a CSP with
 * `style-src 'nonce-…'` accepts it (#403). A `<style>` already holding the
 * same CSS is reused, so several viewers (or a re-mount) add one copy.
 */
export function injectStylesheet(
  wrapper: HTMLElement,
  css: string | undefined,
  nonce?: string,
): void {
  if (!css || typeof wrapper.getRootNode !== "function") return;
  const doc = wrapper.ownerDocument;
  const root = wrapper.getRootNode();
  // Duck-typed: a ShadowRoot from another window fails `instanceof`.
  const isShadowRoot = root.nodeType === 11 && "host" in root;
  const container: ParentNode | null = isShadowRoot
    ? (root as ShadowRoot)
    : doc.head;
  if (!container) return;

  const existing = container.querySelectorAll(`style[${STYLE_MARKER}]`);
  for (let index = 0; index < existing.length; index += 1) {
    if (existing[index].textContent === css) return;
  }

  const style = doc.createElement("style");
  style.setAttribute(STYLE_MARKER, "");
  if (nonce) style.setAttribute("nonce", nonce);
  style.textContent = css;
  // Appended, like style-inject did before (the bundle used to add it at load).
  container.appendChild(style);
}

export const getTransformStyles = (
  x: number,
  y: number,
  scale: number,
): string => {
  // Standard translate prevents blurry svg on the safari
  const s = roundScaleForTransform(scale);
  return `translate(${x}px, ${y}px) scale(${s})`;
};

export const getMatrixTransformStyles = (
  x: number,
  y: number,
  scale: number,
): string => {
  // The shorthand for matrix does not work for Safari hence the need to explicitly use matrix3d
  // Refer to https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
  const a = scale;
  const b = 0;
  const c = 0;
  const d = scale;
  const tx = x;
  const ty = y;
  return `matrix3d(${a}, ${b}, 0, 0, ${c}, ${d}, 0, 0, 0, 0, 1, 0, ${tx}, ${ty}, 0, 1)`;
};

export const getCenterPosition = (
  scale: number,
  wrapperComponent: HTMLDivElement,
  contentComponent: HTMLDivElement,
): StateType => {
  const contentWidth = contentComponent.offsetWidth * scale;
  const contentHeight = contentComponent.offsetHeight * scale;

  const centerPositionX = (wrapperComponent.clientWidth - contentWidth) / 2;
  const centerPositionY = (wrapperComponent.clientHeight - contentHeight) / 2;

  return {
    scale,
    positionX: centerPositionX,
    positionY: centerPositionY,
  };
};
