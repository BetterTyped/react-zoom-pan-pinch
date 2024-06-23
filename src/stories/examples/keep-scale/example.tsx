import React from "react";

import { TransformComponent, TransformWrapper, KeepScale } from "components";
import { normalizeArgs } from "../../utils";
import exampleImg from "../../assets/map.jpg";
import { ReactComponent as Pin } from "../../assets/pin.svg";

export const Example: React.FC<any> = (args: any) => {
  return (
    <TransformWrapper {...normalizeArgs(args)} maxScale={100}>
      <TransformComponent
        wrapperStyle={{
          width: "400px",
          height: "400px",
          maxWidth: "70vw",
          maxHeight: "70vh",
        }}
        contentStyle={{
          width: "400px",
          height: "400px",
          maxWidth: "70vw",
          maxHeight: "70vh",
        }}
      >
        <div
          style={{
            position: "relative",
            background: "#999",
          }}
        >
          <h2>Pins will keep the initial scale with KeepScale component</h2>

          <img
            style={{ width: "600px", height: "300px" }}
            src={exampleImg}
            alt=""
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              marginLeft: "-200px",
            }}
          >
            <KeepScale>
              <Pin fill="red" style={{ width: "20px", height: "20px" }} />
            </KeepScale>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              marginLeft: "200px",
            }}
          >
            <KeepScale>
              <Pin fill="red" style={{ width: "20px", height: "20px" }} />
            </KeepScale>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              marginBottom: "150px",
            }}
          >
            <KeepScale>
              <Pin fill="red" style={{ width: "20px", height: "20px" }} />
            </KeepScale>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              marginTop: "100px",
            }}
          >
            <KeepScale>
              <Pin fill="red" style={{ width: "20px", height: "20px" }} />
            </KeepScale>
          </div>
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
};
