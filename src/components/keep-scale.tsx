import React, { useContext, useEffect, useRef } from "react";

import { mergeRefs } from "utils/ref.utils";
import { Context } from "./transform-wrapper";

export const KeepScale = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const localRef = useRef<HTMLDivElement>(null);
  const instance = useContext(Context);

  useEffect(() => {
    return instance.onChange((ctx) => {
      if (localRef.current) {
        const positionX = 0;
        const positionY = 0;
        localRef.current.style.transform = instance.handleTransformStyles(
          positionX,
          positionY,
          1 / ctx.state.scale,
        );
      }
    });
  }, [instance]);

  return <div {...props} ref={mergeRefs([localRef, ref])} />;
});
