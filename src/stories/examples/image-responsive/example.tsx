import React, { useState, useEffect, useMemo, useCallback } from "react";

import { TransformComponent, TransformWrapper } from "components";
import { normalizeArgs } from "stories/utils";
import exampleImg from "../../assets/medium-image.jpg";

export const Example: React.FC<any> = (args: any) => {
  const src = exampleImg;
  const alt = "example";
  const backgroundColor = "black";
  const scaleUp = true;
  const zoomFactor = 8;

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const [imageNaturalWidth, setImageNaturalWidth] = useState<number>(0);
  const [imageNaturalHeight, setImageNaturalHeight] = useState<number>(0);

  const imageScale = useMemo(() => {
    if (
      containerWidth === 0 ||
      containerHeight === 0 ||
      imageNaturalWidth === 0 ||
      imageNaturalHeight === 0
    )
      return 0;
    const scale = Math.min(
      containerWidth / imageNaturalWidth,
      containerHeight / imageNaturalHeight,
    );
    return scaleUp ? scale : Math.max(scale, 1);
  }, [
    scaleUp,
    containerWidth,
    containerHeight,
    imageNaturalWidth,
    imageNaturalHeight,
  ]);

  const handleResize = useCallback(() => {
    if (container !== null) {
      const rect = container.getBoundingClientRect();
      setContainerWidth(rect.width);
      setContainerHeight(rect.height);
    } else {
      setContainerWidth(0);
      setContainerHeight(0);
    }
  }, [container]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const handleImageOnLoad = (image: HTMLImageElement) => {
    setImageNaturalWidth(image.naturalWidth);
    setImageNaturalHeight(image.naturalHeight);
  };

  useEffect(() => {
    const image = new Image();
    image.onload = () => handleImageOnLoad(image);
    image.src = src;
  }, [src]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor,
      }}
      ref={(el: HTMLDivElement | null) => setContainer(el)}
    >
      {imageScale > 0 && (
        <TransformWrapper
          key={`${containerWidth}x${containerHeight}`}
          initialScale={imageScale}
          minScale={imageScale}
          maxScale={imageScale * zoomFactor}
          centerOnInit
          {...normalizeArgs(args)}
        >
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
            }}
          >
            <img alt={alt} src={src} />
          </TransformComponent>
        </TransformWrapper>
      )}
    </div>
  );
};
