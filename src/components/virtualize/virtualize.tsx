import React, { useContext, useRef, useState } from "react";

import { Context } from "../transform-wrapper/transform-wrapper";
import { useIsomorphicLayoutEffect } from "../../utils/effect.utils";
import { isElementVisible } from "./virtualize.utils";

/* eslint-disable react/require-default-props */
export type VirtualizeProps = {
  /** Horizontal position of the element in content (unscaled) space. */
  x: number;
  /** Vertical position of the element in content (unscaled) space. */
  y: number;
  /** Width of the element in content (unscaled) space. */
  width: number;
  /** Height of the element in content (unscaled) space. */
  height: number;

  /**
   * Extra pixels around the viewport that still count as "visible".
   * Positive values mount children before they scroll into view,
   * acting like `IntersectionObserver`'s `rootMargin`.
   * @default 0
   */
  margin?: number;

  /**
   * Fraction of the element area (0-1) that must overlap the (expanded)
   * viewport for the children to be mounted.
   *
   * - `0` — any overlap is enough (default).
   * - `1` — the element must be fully inside the viewport.
   * @default 0
   */
  threshold?: number;

  /**
   * Content rendered in place of children when the element is outside
   * the viewport.  Defaults to `null` (nothing rendered).
   */
  placeholder?: React.ReactNode;

  /** Fires when the element enters the viewport and children are mounted. */
  onShow?: () => void;
  /** Fires when the element leaves the viewport and children are unmounted. */
  onHide?: () => void;

  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const Virtualize = React.forwardRef<HTMLDivElement, VirtualizeProps>(
  (
    {
      x,
      y,
      width,
      height,
      margin = 0,
      threshold = 0,
      placeholder = null,
      onShow,
      onHide,
      children,
      className,
      style,
    },
    ref,
  ) => {
    const instance = useContext(Context);

    const computeVisible = () => {
      const wrapper = instance.wrapperComponent;
      if (!wrapper) return false;

      return isElementVisible({
        elementX: x,
        elementY: y,
        elementWidth: width,
        elementHeight: height,
        scale: instance.state.scale,
        positionX: instance.state.positionX,
        positionY: instance.state.positionY,
        viewportWidth: wrapper.clientWidth,
        viewportHeight: wrapper.clientHeight,
        margin,
        threshold,
      });
    };

    // Elements mounted after the wrapper is initialized (items added to a
    // canvas at runtime) render their children in the very first commit
    // instead of one frame later.
    const [visible, setVisible] = useState(computeVisible);
    const visibleRef = useRef(false);

    const onShowRef = useRef(onShow);
    const onHideRef = useRef(onHide);
    onShowRef.current = onShow;
    onHideRef.current = onHide;

    // Layout effect so the check triggered by the wrapper's init (also a
    // layout effect) re-renders before the browser paints.
    useIsomorphicLayoutEffect(() => {
      const check = () => {
        if (!instance.wrapperComponent) return;

        const nowVisible = computeVisible();

        if (nowVisible !== visibleRef.current) {
          visibleRef.current = nowVisible;
          setVisible(nowVisible);
          if (nowVisible) {
            onShowRef.current?.();
          } else {
            onHideRef.current?.();
          }
        }
      };

      check();
      const unsubChange = instance.onChange(check);

      let unsubInit: (() => void) | undefined;
      if (!instance.wrapperComponent) {
        unsubInit = instance.onInit(() => check());
      }

      return () => {
        unsubChange();
        unsubInit?.();
      };
    }, [instance, x, y, width, height, margin, threshold]);

    if (!visible) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return placeholder ? <>{placeholder}</> : null;
    }

    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  },
);
