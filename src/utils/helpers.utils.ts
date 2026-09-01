import { baseClasses } from "../constants/state.constants";

const matchPrefix = `.${baseClasses.wrapperClass}`;

export const isExcludedNode = (
  node: HTMLElement,
  excluded: string[],
): boolean => {
  return excluded.some((exclude) =>
    node.matches(
      `${matchPrefix} ${exclude}, ${matchPrefix} .${exclude}, ${matchPrefix} ${exclude} *, ${matchPrefix} .${exclude} *`,
    ),
  );
};

const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT", "OPTION"]);
const CONTENT_EDITABLE_SELECTOR =
  '[contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"]';
const DRAGGABLE_SELECTOR = '[draggable="true"]';

const asElement = (node: EventTarget | null): HTMLElement | null => {
  // Duck-typed on purpose: `instanceof Element` fails for nodes that belong
  // to another window (portals, popups), see #290.
  if (!node || typeof (node as HTMLElement).closest !== "function") {
    return null;
  }
  return node as HTMLElement;
};

/**
 * Form controls and contenteditable regions (or anything nested inside them).
 * Starting a pan or a double-click zoom from these would steal focus and block
 * native text editing (#437, #544).
 */
export const isEditableTarget = (node: EventTarget | null): boolean => {
  const element = asElement(node);
  if (!element) return false;
  if (EDITABLE_TAGS.has(element.tagName)) return true;
  if (element.isContentEditable) return true;
  return element.closest(CONTENT_EDITABLE_SELECTOR) !== null;
};

/**
 * HTML5 drag sources (or anything nested inside them). A pan started here
 * would call `preventDefault` on mousedown and cancel the native drag (#460).
 */
export const isDraggableTarget = (node: EventTarget | null): boolean => {
  const element = asElement(node);
  if (!element) return false;
  return element.closest(DRAGGABLE_SELECTOR) !== null;
};

export const cancelTimeout = (
  timeout: ReturnType<typeof setTimeout> | null,
): void => {
  if (timeout) {
    clearTimeout(timeout);
  }
};
