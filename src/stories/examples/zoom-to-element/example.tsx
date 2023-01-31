import React from "react";

import { TransformWrapper } from "../../../components/transform-wrapper";
import { TransformComponent } from "../../../components/transform-component";
import { normalizeArgs } from "../../utils";

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
              Zoom to element 1
            </button>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={() => zoomToElement("element2")}
            >
              Zoom to element 2
            </button>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={() => zoomToElement("element3")}
            >
              Zoom to element 3
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
            <div
              style={{
                background: "#444",
                color: "white",
                padding: "50px",
                minHeight: "300px",
                width: "100%",
              }}
            >
              <div
                id="element1"
                style={{ background: "red", width: "200px", height: "400px" }}
              >
                Zoom element 1
              </div>
              <div
                id="element2"
                style={{
                  background: "blue",
                  width: "250px",
                  height: "150px",
                  marginTop: "200px",
                  marginLeft: "200px",
                }}
              >
                Zoom element 2
              </div>
              <div
                id="element3"
                style={{
                  background: "green",
                  width: "150px",
                  height: "150px",
                  marginTop: "200px",
                  marginLeft: "500px",
                }}
              >
                Zoom element 3
              </div>
            </div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};
