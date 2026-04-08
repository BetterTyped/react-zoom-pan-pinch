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
    type: ["function(step, animationTime, animationType)"],
    parameters: [
      "step: number = 0.5",
      "animationTime: number = 300",
      "animationType: keyof typeof animations = easeOut",
    ],
    description: "Function used for zoom in button",
  },
  zoomOut: {
    type: ["function(step, animationTime, animationType)"],
    parameters: [
      "step: number = 0.5",
      "animationTime: number = 300",
      "animationType: keyof typeof animations = easeOut",
    ],
    description: "Function used for zoom out button",
  },
  setTransform: {
    type: ["function(x, y, scale, animationTime, animationType)"],
    parameters: [
      "x: number",
      "y: number",
      "scale: number",
      "animationTime: number = 300",
      "animationType: keyof typeof animations = easeOut",
    ],
    description: "Function used for custom transformation animation",
  },
  resetTransform: {
    type: ["function(animationTime, animationType)"],
    parameters: [
      "animationTime: number = 200",
      "animationType: keyof typeof animations = easeOut",
    ],
    description: "Function used for reset button",
  },
  centerView: {
    type: ["function(scale, animationTime, animationType)"],
    parameters: [
      "scale: number = undefined",
      "animationTime: number = 200",
      "animationType: keyof typeof animations = easeOut",
    ],
    description: "Function used for centering the content component",
  },
  zoomToElement: {
    type: [
      "function(node, scale, animationTime, animationType, offsetX, offsetY)",
    ],
    parameters: [
      "node: HTMLElement | string",
      "scale: number = undefined",
      "animationTime: number = 600",
      "animationType: keyof typeof animations = easeOut",
      "offsetX: number = 0",
      "offsetY: number = 0",
    ],
    description:
      "This function make a transition for certain node provided to the function(as node element or it's id string). It allows only to zoom elements with offsetWidth and offsetHeight properties - since SVG's doesn't have those, it is impossible to perform it on such elements.",
  },
};

export const getHandlersTable = (): ControlsFnOptionsType[] => {
  return (Object.keys(handlersTable) as (keyof ComponentProps)[]).reduce<
    ControlsFnOptionsType[]
  >((acc, key) => {
    const entry = handlersTable[key];
    if ("type" in entry && Array.isArray(entry.type)) {
      acc.push({
        ...(entry as Omit<ControlsFnOptionsType, "name" | "isObjectRow">),
        name: key,
      });
    } else {
      const nested = entry as Record<
        string,
        Omit<ControlsFnOptionsType, "name" | "isObjectRow">
      >;
      Object.keys(nested).forEach((prop) => {
        acc.push({
          ...nested[prop],
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
  }, []);
};
