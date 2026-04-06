/* eslint-disable no-param-reassign */
import type * as React from "react";

export function assignRef<T>(
  ref:
    | ((value: T | null) => void)
    | React.MutableRefObject<T | null>
    | null
    | undefined,
  value: T | null,
): void {
  if (ref == null) return;
  if (typeof ref === "function") {
    ref(value);
  } else {
    ref.current = value;
  }
}

export function mergeRefs<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>,
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}
