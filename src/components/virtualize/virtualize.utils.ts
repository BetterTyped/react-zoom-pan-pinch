export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Compute the overlap area between two axis-aligned rectangles.
 * Returns 0 when the rectangles do not intersect.
 */
export function getOverlapArea(a: Rect, b: Rect): number {
  const overlapX = Math.max(
    0,
    Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x),
  );
  const overlapY = Math.max(
    0,
    Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y),
  );
  return overlapX * overlapY;
}

export type IsElementVisibleOptions = {
  /** Element position and size in content (unscaled) coordinates. */
  elementX: number;
  elementY: number;
  elementWidth: number;
  elementHeight: number;

  /** Current transform state. */
  scale: number;
  positionX: number;
  positionY: number;

  /** Viewport (wrapper) dimensions in pixels. */
  viewportWidth: number;
  viewportHeight: number;

  /**
   * Extra pixels around the viewport that still count as "visible".
   * Positive values mount elements before they scroll into view.
   * Default: 0
   */
  margin?: number;

  /**
   * Fraction of the element area (0-1) that must overlap the viewport for
   * the element to be considered visible.
   * 0 = any overlap is enough (default).
   * 1 = element must be fully inside the viewport.
   */
  threshold?: number;
};

/**
 * Determine whether an element's content-space bounding box is visible
 * in the current viewport, accounting for transform, margin, and threshold.
 */
export function isElementVisible(opts: IsElementVisibleOptions): boolean {
  const {
    elementX,
    elementY,
    elementWidth,
    elementHeight,
    scale,
    positionX,
    positionY,
    viewportWidth,
    viewportHeight,
    margin = 0,
    threshold = 0,
  } = opts;

  const viewport: Rect = {
    x: -margin,
    y: -margin,
    width: viewportWidth + 2 * margin,
    height: viewportHeight + 2 * margin,
  };

  const element: Rect = {
    x: elementX * scale + positionX,
    y: elementY * scale + positionY,
    width: elementWidth * scale,
    height: elementHeight * scale,
  };

  if (threshold <= 0) {
    const intersectsX =
      element.x < viewport.x + viewport.width &&
      element.x + element.width > viewport.x;
    const intersectsY =
      element.y < viewport.y + viewport.height &&
      element.y + element.height > viewport.y;
    return intersectsX && intersectsY;
  }

  const elementArea = element.width * element.height;
  if (elementArea <= 0) return false;

  const overlap = getOverlapArea(viewport, element);
  return overlap / elementArea >= threshold;
}
