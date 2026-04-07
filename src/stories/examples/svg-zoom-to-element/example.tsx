import React from "react";

import { TransformComponent, TransformWrapper } from "components";
import {
  Controls,
  NumberedTargetIcon,
  normalizeArgs,
  viewerChrome,
} from "../../utils";
import { ReactComponent as Creativity } from "./creativity.svg";

const ZOOMABLE_IDS = ["element1", "element2", "element3"];

function findZoomableId(el: HTMLElement | SVGElement | null): string | null {
  let node = el;
  while (node) {
    if (node.id && ZOOMABLE_IDS.includes(node.id)) return node.id;
    node = node.parentElement as HTMLElement | null;
  }
  return null;
}

export const Example: React.FC<any> = (args: any) => {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        #element1, #element2, #element3 {
          cursor: pointer;
          transition: filter 0.2s ease, opacity 0.2s ease;
        }
        #element1:hover, #element2:hover, #element3:hover {
          filter: brightness(1.3) drop-shadow(0 0 6px rgba(99, 102, 241, 0.6));
          opacity: 0.85;
        }
      `}</style>
      <TransformWrapper {...normalizeArgs(args)} centerOnInit>
        {(utils) => {
          const handleSvgClick = (e: React.MouseEvent) => {
            const id = findZoomableId(e.target as HTMLElement);
            if (id) utils.zoomToElement(id);
          };

          return (
            <>
              <Controls
                {...utils}
                extraButtons={[
                  {
                    label: "Focus element 1",
                    icon: <NumberedTargetIcon n={1} />,
                    onClick: () => utils.zoomToElement("element1"),
                  },
                  {
                    label: "Focus element 2",
                    icon: <NumberedTargetIcon n={2} />,
                    onClick: () => utils.zoomToElement("element2"),
                  },
                  {
                    label: "Focus element 3",
                    icon: <NumberedTargetIcon n={3} />,
                    onClick: () => utils.zoomToElement("element3"),
                  },
                ]}
              />
              <TransformComponent
                wrapperStyle={{
                  width: "500px",
                  height: "500px",
                  maxWidth: "80vw",
                  maxHeight: "75vh",
                  ...viewerChrome,
                }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Click an SVG element to zoom to it"
                  onClick={handleSvgClick}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSvgClick(e as unknown as React.MouseEvent);
                    }
                  }}
                >
                  <Creativity style={{ width: "100%" }} />
                </div>
              </TransformComponent>
            </>
          );
        }}
      </TransformWrapper>
    </div>
  );
};
