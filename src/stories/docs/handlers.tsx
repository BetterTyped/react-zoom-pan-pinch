import React from "react";

import { ReactZoomPanPinchHandlers } from "../../models/context.model";

export type ControlsFnOptionsType = {
  name: React.ReactNode;
  type: string[];
  parameters: string[];
  description: string;
  isObjectRow?: boolean;
};

export type ComponentProps = Record<
  keyof ReactZoomPanPinchHandlers,
  | Omit<ControlsFnOptionsType, "name" | "isObjectRow">
  | Record<string, Omit<ControlsFnOptionsType, "name" | "isObjectRow">>
>;

export const handlersTable: ComponentProps = {
  zoomIn: {
    type: ["function(step, animationTime, animationName)"],
    parameters: [
      "step: number = 0.5",
      "animationTime: number = 300",
      "animationName: string = easeOut",
    ],
    description: "Function used for zoom in button",
  },
  zoomOut: {
    type: ["function(step, animationTime, animationName)"],
    parameters: [
      "step: number = 0.5",
      "animationTime: number = 300",
      "animationName: string = easeOut",
    ],
    description: "Function used for zoom out button",
  },
  setTransform: {
    type: ["function(x, y, scale, animationTime, animationName)"],
    parameters: [
      "x: number",
      "y: number",
      "scale: number",
      "animationTime: number = 300",
      "animationName: string = easeOut",
    ],
    description: "Function used for custom transformation animation",
  },
  resetTransform: {
    type: ["function(animationTime, animationName)"],
    parameters: [
      "animationTime: number = 300",
      "animationName: string = easeOut",
    ],
    description: "Function used for reset button",
  },
  centerView: {
    type: ["function(scale, animationTime, animationName)"],
    parameters: [
      "scale: number = undefined",
      "animationTime: number = 300",
      "animationName: string = easeOut",
    ],
    description: "Function used for centering the content component",
  },
  zoomToElement: {
    type: ["function(node, customZoom, animationTime, animationName)"],
    parameters: [
      "node: HTMLElement | string",
      "customScale: number = undefined",
      "animationTime: number = 300",
      "animationName: string = easeOut",
    ],
    description:
      "This function make a transition for certain node provided to the function(as node element or it's id string). It allows only to zoom elements with offsetWidth and offsetHeight properties - since SVG's doesn't have those, it is impossible to perform it on such elements.",
  },
};

export const getHandlersTable = (): ControlsFnOptionsType[] => {
  return Object.keys(handlersTable).reduce<ControlsFnOptionsType[]>(
    (acc, key) => {
      if (Array.isArray(handlersTable[key]?.type)) {
        acc.push({
          ...handlersTable[key],
          name: key,
        });
      } else {
        Object.keys(handlersTable[key]).forEach((prop) => {
          acc.push({
            ...handlersTable[key][prop],
            isObjectRow: key === prop,
            name:
              key === prop ? (
                <b>{prop}</b>
              ) : (
                <>
                  {key}.<b>{prop}</b>
                </>
              ),
          });
        });
      }
      return acc;
    },
    [],
  );
};
