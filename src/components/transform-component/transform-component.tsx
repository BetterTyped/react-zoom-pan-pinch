/* eslint-disable react/require-default-props */
import React, { useContext, useEffect, useRef } from "react";

import { Context } from "../transform-wrapper/transform-wrapper";
import { baseClasses } from "../../constants/state.constants";
import { getTransformStyles, injectStylesheet } from "../../utils/styles.utils";
import { useIsomorphicLayoutEffect } from "../../utils/effect.utils";

// Namespace import: only the library build (rollup-plugin-postcss with
// `inject: false`) exports `stylesheet`. A named import would be a hard
// error under bundlers that load the CSS module themselves (Vite in
// Storybook); a missing property is just undefined.
import * as cssModule from "./transform-component.module.css";

const styles = cssModule.default;
const { stylesheet } = cssModule;

type Props = {
  children: React.ReactNode;
  wrapperClass?: string;
  contentClass?: string;
  wrapperStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  contentProps?: React.HTMLAttributes<HTMLDivElement>;
  /**
   * When true, renders an infinite dot-grid background behind the content
   * that scales and pans in sync with the transform. Pair with
   * `limitToBounds={false}` on TransformWrapper for full effect.
   */
  infinite?: boolean;
  /**
   * Nonce for the `<style>` the component adds, for a Content Security
   * Policy with `style-src 'nonce-…'`.
   */
  nonce?: string;
  /**
   * Do not add the stylesheet; load `react-zoom-pan-pinch/dist/styles.css`
   * yourself instead (a CSP that allows no inline `<style>`).
   */
  disableStyleInjection?: boolean;
};

export const TransformComponent: React.FC<Props> = ({
  children,
  wrapperClass = "",
  contentClass = "",
  wrapperStyle,
  contentStyle,
  wrapperProps = {},
  contentProps = {},
  infinite = false,
  nonce,
  disableStyleInjection = false,
}: Props) => {
  const instance = useContext(Context);
  const { init, cleanupWindowEvents } = instance;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Layout effect: the initial transform (initialPosition*, centerOnInit)
  // and the first visibility check of virtualized children happen before the
  // browser paints, so nothing jumps into place a frame late.
  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    // Before `init` measures anything: the sizes depend on these rules.
    if (wrapper !== null && !disableStyleInjection) {
      injectStylesheet(wrapper, stylesheet, nonce);
    }
    if (wrapper !== null && content !== null && init) {
      init?.(wrapper, content);
    }
    return () => {
      cleanupWindowEvents?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!infinite) return;
    const grid = gridRef.current;
    if (!grid) return;

    const sync = () => {
      const { positionX, positionY } = instance.state;
      grid.style.backgroundPosition = `${positionX}px ${positionY}px`;
    };

    sync();
    return instance.onChange(sync);
  }, [infinite, instance]);

  // Keyboard navigation (#254) needs a focus target; `wrapperProps.tabIndex`
  // still wins because it is spread afterwards.
  const keyboardEnabled = !instance.setup.keyboard?.disabled;

  return (
    <div
      // The wrapper is a keyboard-operated widget when navigation is on.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={keyboardEnabled ? 0 : undefined}
      {...wrapperProps}
      ref={wrapperRef}
      className={`${baseClasses.wrapperClass} ${styles.wrapper} ${wrapperClass}`}
      style={wrapperStyle}
    >
      {infinite && (
        <div ref={gridRef} className={styles.infiniteGrid} aria-hidden />
      )}
      <div
        {...contentProps}
        ref={contentRef}
        className={`${baseClasses.contentClass} ${styles.content} ${contentClass}`}
        style={{
          // Inline so the zoom anchor survives environments where the
          // stylesheet is not applied, e.g. a shadow root (#371, #444).
          transformOrigin: "0 0",
          ...contentStyle,
          transform: getTransformStyles(
            instance.state.positionX,
            instance.state.positionY,
            instance.state.scale,
          ),
        }}
      >
        {children}
      </div>
    </div>
  );
};
