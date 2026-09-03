import React, { useState } from "react";

import { TransformComponent, TransformWrapper } from "components";
import {
  Controls,
  FocusChips,
  NumberedTargetIcon,
  normalizeArgs,
  viewerChrome,
} from "../../utils";
import { ReactComponent as Creativity } from "./creativity.svg";

const TARGETS = [
  { id: "element1", label: "Element 1", accent: "#f4f4f5" },
  { id: "element2", label: "Element 2", accent: "#ec7e96" },
  { id: "element3", label: "Element 3", accent: "#a78bfa" },
];

const ZOOMABLE_IDS = TARGETS.map((t) => t.id);

function findZoomableId(el: HTMLElement | SVGElement | null): string | null {
  let node = el;
  while (node) {
    if (node.id && ZOOMABLE_IDS.includes(node.id)) return node.id;
    node = node.parentElement as HTMLElement | null;
  }
  return null;
}

export const Example: React.FC<any> = (args: any) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const clearActive = () => setActiveId(null);

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
      <TransformWrapper
        {...normalizeArgs(args)}
        centerOnInit
        onPanningStart={clearActive}
        onWheelStart={clearActive}
        onPinchStart={clearActive}
      >
        {(utils) => {
          const focus = (id: string) => {
            setActiveId(id);
            utils.zoomToElement(id);
          };

          const handleSvgClick = (e: React.MouseEvent) => {
            const id = findZoomableId(e.target as HTMLElement);
            if (id) focus(id);
          };

          return (
            <div style={{ position: "relative", display: "inline-block" }}>
              <Controls
                {...utils}
                resetTransform={(...rest) => {
                  clearActive();
                  return utils.resetTransform(...rest);
                }}
              />
              <FocusChips
                title="Zoom to"
                position="bottom-left"
                activeId={activeId}
                onSelect={focus}
                items={TARGETS.map((t, i) => ({
                  id: t.id,
                  label: t.label,
                  icon: <NumberedTargetIcon n={i + 1} />,
                  accent: t.accent,
                }))}
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
            </div>
          );
        }}
      </TransformWrapper>
    </div>
  );
};
