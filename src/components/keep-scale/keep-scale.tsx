import React, { useContext, useRef } from "react";

import { mergeRefs } from "utils/ref.utils";
import { useIsomorphicLayoutEffect } from "utils/effect.utils";
import { Context } from "../transform-wrapper/transform-wrapper";

export const KeepScale = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const localRef = useRef<HTMLDivElement>(null);
  const instance = useContext(Context);

  useIsomorphicLayoutEffect(() => {
    const applyInverseScale = (scale: number) => {
      if (localRef.current) {
        const positionX = 0;
        const positionY = 0;
        localRef.current.style.transform = instance.handleTransformStyles(
          positionX,
          positionY,
          1 / scale,
        );
      }
    };

    // Apply immediately: an element mounted while already zoomed must not
    // wait for the next transform change to get its counter-scale.
    applyInverseScale(instance.state.scale);

    return instance.onChange((ctx) => {
      applyInverseScale(ctx.instance.state.scale);
    });
  }, [instance]);

  return <div {...props} ref={mergeRefs([localRef, ref])} />;
});
