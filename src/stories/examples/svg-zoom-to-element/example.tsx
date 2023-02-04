import React from "react";

import { TransformWrapper } from "../../../components/transform-wrapper";
import { TransformComponent } from "../../../components/transform-component";
import { normalizeArgs } from "../../utils";
import { ReactComponent as Creativity } from "./creativity.svg";

import styles from "../../utils/styles.module.css";

export const Example: React.FC<any> = (args: any) => {
  return (
    <TransformWrapper {...normalizeArgs(args)}>
      {({ zoomToElement, resetTransform }) => (
        <>
          <div>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={() => zoomToElement("element1")}
            >
              Zoom to Cloud
            </button>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={() => zoomToElement("element2")}
            >
              Zoom to Face
            </button>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={() => zoomToElement("element3")}
            >
              Zoom to Plane
            </button>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={() => resetTransform()}
            >
              Reset
            </button>
          </div>
          <TransformComponent
            wrapperStyle={{
              maxWidth: "100%",
              maxHeight: "calc(100vh - 50px)",
            }}
          >
            <Creativity />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};
