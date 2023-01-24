import React, { useEffect, useState } from "react";

import { TransformWrapper } from "../../../components/transform-wrapper";
import { TransformComponent } from "../../../components/transform-component";
import { normalizeArgs } from "../../utils";

export const Example: React.FC<any> = (args: any) => {
  const [firstBlock, setFirstBlock] = useState(false);
  const [secondBlock, setSecondBlock] = useState(false);
  const [thirdBlock, setThirdBlock] = useState(false);

  useEffect(() => {
    const a = setInterval(() => {
      setFirstBlock((prev) => !prev);
    }, 1000);
    const b = setInterval(() => {
      setSecondBlock((prev) => !prev);
    }, 3000);
    const c = setInterval(() => {
      setThirdBlock((prev) => !prev);
    }, 12000);
    return () => {
      clearInterval(a);
      clearInterval(b);
      clearInterval(c);
    };
  }, []);

  return (
    <TransformWrapper {...normalizeArgs(args)}>
      <TransformComponent
        wrapperStyle={{
          width: "500px",
          height: "500px",
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
          <h2>Constantly rerendering content</h2>

          {firstBlock ? <p>Content #1</p> : <p>Changed Content #1</p>}

          {secondBlock ? <p>Content #2</p> : <p>Changed Content #2</p>}

          {thirdBlock ? (
            <p>Content #3</p>
          ) : (
            <p>
              Changed Content #3
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>
          )}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
};
