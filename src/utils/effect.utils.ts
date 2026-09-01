import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` in the browser, `useEffect` during server rendering.
 *
 * DOM measurements and the initial transform must run before the first paint
 * (otherwise `centerOnInit`, `initialPosition*` and virtualized children flash
 * into place one frame late), but `useLayoutEffect` warns on the server.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
