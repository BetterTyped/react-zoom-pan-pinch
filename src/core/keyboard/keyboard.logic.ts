import { ReactZoomPanPinchContext } from "../../models";
import { isEditableTarget, isExcludedNode } from "../../utils/helpers.utils";
import { getControls } from "../../utils/context.utils";

/**
 * Keys handled by the keyboard navigation (#254). Arrows pan by
 * `keyboard.panStep`, plus/minus zoom by `keyboard.zoomStep`, `0` resets.
 */
export const KEYBOARD_KEYS = {
  panLeft: ["ArrowLeft"],
  panRight: ["ArrowRight"],
  panUp: ["ArrowUp"],
  panDown: ["ArrowDown"],
  zoomIn: ["+", "="],
  zoomOut: ["-", "_"],
  reset: ["0"],
} as const;

const isHandledKey = (key: string): boolean =>
  Object.values(KEYBOARD_KEYS).some((keys) =>
    (keys as readonly string[]).includes(key),
  );

/**
 * Wrapper `keydown` handler. Returns `true` when the key was consumed (and
 * its default action prevented), `false` when it was left to the browser.
 *
 * Ignored on purpose: modifier combos (ctrl/cmd/alt, so browser shortcuts
 * such as cmd+0 / cmd+- keep working), editable targets (typing in an input
 * inside the content) and `keyboard.excluded` targets.
 */
export function handleKeyboardNavigation(
  contextInstance: ReactZoomPanPinchContext,
  event: KeyboardEvent,
): boolean {
  const { disabled, keyboard, panning } = contextInstance.setup;
  if (disabled || keyboard.disabled) return false;
  if (event.defaultPrevented) return false;
  if (event.ctrlKey || event.metaKey || event.altKey) return false;
  if (!isHandledKey(event.key)) return false;

  const target = event.target as HTMLElement | null;
  if (isEditableTarget(target)) return false;
  if (
    target &&
    typeof target.matches === "function" &&
    isExcludedNode(target, keyboard.excluded)
  ) {
    return false;
  }

  const { panStep, zoomStep, animationTime, animationType } = keyboard;
  const controls = getControls(contextInstance);
  const { key } = event;

  // Arrow keys move the *viewport*, like scrolling: pressing left reveals
  // content on the left, so the content itself shifts right (position grows).
  const stepX = panning.lockAxisX ? 0 : panStep;
  const stepY = panning.lockAxisY ? 0 : panStep;

  if (key === "ArrowLeft") {
    controls.panBy(stepX, 0, animationTime, animationType);
  } else if (key === "ArrowRight") {
    controls.panBy(-stepX, 0, animationTime, animationType);
  } else if (key === "ArrowUp") {
    controls.panBy(0, stepY, animationTime, animationType);
  } else if (key === "ArrowDown") {
    controls.panBy(0, -stepY, animationTime, animationType);
  } else if (key === "+" || key === "=") {
    controls.zoomIn(zoomStep, animationTime, animationType);
  } else if (key === "-" || key === "_") {
    controls.zoomOut(zoomStep, animationTime, animationType);
  } else if (key === "0") {
    controls.resetTransform(animationTime, animationType);
  }

  if (event.cancelable) {
    event.preventDefault();
  }
  // Consumed: hosts that forward key presses (Storybook's manager, app-level
  // shortcuts) must not also act on them.
  event.stopPropagation();
  return true;
}
