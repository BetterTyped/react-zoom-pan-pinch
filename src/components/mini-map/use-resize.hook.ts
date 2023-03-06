import { useLayoutEffect, useRef } from "react";

export type NonNullableKeys<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export type Nullable<T> = T | null;

export type ElementRect = Omit<DOMRect, "toJSON">;

const initialElementRect: ElementRect = {
  width: 0,
  height: 0,
  y: 0,
  x: 0,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

type ResizeHandler<T extends HTMLElement> = (
  elementRect: ElementRect,
  element: T,
) => void;

export const useResize = <T extends HTMLElement>(
  ref: Nullable<T>,
  onResize: ResizeHandler<T>,
  dependencies: any[],
) => {
  const resizeObserverRef = useRef<ResizeObserver>();

  const rectRef = useRef(initialElementRect);

  const didUnmount = useRef(false);

  useLayoutEffect(() => {
    didUnmount.current = false;
    if (ref) {
      resizeObserverRef.current = new ResizeObserver(
        (entries: ResizeObserverEntry[]) => {
          const newSize = ref.getBoundingClientRect();
          if (
            !Array.isArray(entries) ||
            !entries.length ||
            didUnmount.current ||
            (newSize.width === rectRef.current.width &&
              newSize.height === rectRef.current.height)
          )
            return;

          onResize(newSize, ref);
          rectRef.current = newSize;
        },
      );

      resizeObserverRef.current?.observe(ref);
    }

    return () => {
      didUnmount.current = true;
      if (ref) {
        resizeObserverRef.current?.unobserve(ref);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onResize, ref, ...dependencies]);
};
