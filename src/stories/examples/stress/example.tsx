import React, { useRef } from "react";

import { TransformComponent, TransformWrapper } from "components";
import { Controls, normalizeArgs, viewerChrome } from "../../utils";
import exampleImg from "../../assets/small-image.jpg";

import styles from "../../utils/styles.module.css";

export const Example: React.FC<any> = (args: any) => {
  const ref = useRef<any>(null);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <TransformWrapper {...normalizeArgs(args)} ref={ref}>
        {(utils) => (
          <>
            <Controls {...utils} />
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 10,
                padding: "5px 12px",
                borderRadius: 8,
                background: "rgba(10, 10, 18, 0.78)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "0.02em",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              1,000 images
            </div>
            <TransformComponent
              wrapperStyle={{
                ...viewerChrome,
                width: "calc(100vw - 200px)",
                height: "calc(100vh - 200px)",
              }}
            >
              <div className={styles.grid}>
                {Array.from(Array(1000).keys()).map((key) => (
                  <img key={key} src={exampleImg} alt="" />
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};
