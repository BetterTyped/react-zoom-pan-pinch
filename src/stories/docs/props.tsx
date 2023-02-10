import React from "react";

import { ReactZoomPanPinchProps } from "models";
import { initialSetup, initialState } from "../../constants/state.constants";
import { animations } from "../../core/animations/animations.constants";

export type ControlsOptionsType = {
  name: React.ReactNode;
  type: string[];
  defaultValue: string;
  description: string;
  isObjectRow?: boolean;
};

export type ComponentProps = Record<
  keyof Omit<ReactZoomPanPinchProps, "children">,
  | Omit<ControlsOptionsType, "name" | "isObjectRow">
  | Record<string, Omit<ControlsOptionsType, "name" | "isObjectRow">>
>;

const getPropsTable = (propsTable: any): ControlsOptionsType[] => {
  return Object.keys(propsTable).reduce<ControlsOptionsType[]>((acc, key) => {
    if (Array.isArray(propsTable[key]?.type)) {
      acc.push({
        ...propsTable[key],
        name: key,
      });
    } else {
      Object.keys(propsTable[key]).forEach((prop) => {
        acc.push({
          ...propsTable[key][prop],
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

export const componentPropsTable: Record<
  string,
  Omit<ControlsOptionsType, "name">
> = {
  wrapperClass: {
    type: ["string"],
    defaultValue: "''",
    description: "Wrapper element class",
  },
  contentClass: {
    type: ["string"],
    defaultValue: "''",
    description: "Content element class",
  },
  wrapperStyle: {
    type: ["ReactCSSProperties"],
    defaultValue: "undefined",
    description: "Wrapper element style object",
  },
  contentStyle: {
    type: ["ReactCSSProperties"],
    defaultValue: "undefined",
    description: "Content element style object",
  },
};

export const wrapperPropsTable: ComponentProps = {
  ref: {
    type: ["React.Ref<ReactZoomPanPinchRef>"],
    defaultValue: "undefined",
    description: "Get ref value of the react-zoom-pan-pinch context",
  },
  initialScale: {
    type: ["number"],
    defaultValue: String(initialState.scale),
    description:
      "Scale used only as initial value. It will be also used when triggering resetTransform() method or double click feature with 'reset' mode.",
  },
  initialPositionX: {
    type: ["number"],
    defaultValue: String(initialState.positionX),
    description:
      "Position X used only as initial value. It will be also used when triggering resetTransform() method or double click feature with 'reset' mode. Value should be provided in px.",
  },
  initialPositionY: {
    type: ["number"],
    defaultValue: String(initialState.positionY),
    description:
      "Position Y used only as initial value. It will be also used when triggering resetTransform() method or double click feature with 'reset' mode. Value should be provided in px.",
  },
  disabled: {
    type: ["boolean"],
    defaultValue: String(initialSetup.disabled),
    description:
      "This is 'global' disable props. Setting it as a 'true' value blocks all functionalities of library. For disabling parts of it like panning, zooming, pinch - checkout the dedicated sections below.",
  },
  minPositionX: {
    type: ["number"],
    defaultValue: String(initialSetup.minPositionX),
    description:
      "Bounding position which will limit the transformation to given value. Value should be provided in px.",
  },
  maxPositionX: {
    type: ["number"],
    defaultValue: String(initialSetup.maxPositionX),
    description:
      "Bounding position which will limit the transformation to given value. Value should be provided in px.",
  },
  minPositionY: {
    type: ["number"],
    defaultValue: String(initialSetup.minPositionY),
    description:
      "Bounding position which will limit the transformation to given value. Value should be provided in px.",
  },
  maxPositionY: {
    type: ["number"],
    defaultValue: String(initialSetup.minPositionY),
    description:
      "Bounding position which will limit the transformation to given value. Value should be provided in px.",
  },
  minScale: {
    type: ["number"],
    defaultValue: String(initialSetup.minScale),
    description: "Bounding position which will limit the scale to given value",
  },
  maxScale: {
    type: ["number"],
    defaultValue: String(initialSetup.maxScale),
    description: "Bounding position which will limit the scale to given value",
  },
  limitToBounds: {
    type: ["boolean"],
    defaultValue: String(initialSetup.limitToBounds),
    description:
      "Prop used to block panning/zooming outside of the scaled element, so the library will always keep it inside the wrapper view.",
  },
  centerZoomedOut: {
    type: ["boolean"],
    defaultValue: String(initialSetup.centerZoomedOut),
    description:
      "When the zoom goes under the 1 value, the library will keep the content component always in the center. Setting it to false will allow to move the scaled element.",
  },
  centerOnInit: {
    type: ["boolean"],
    defaultValue: String(initialSetup.centerOnInit),
    description:
      "When the prop is set to truth the content component will get centered based on the size of it's wrapper.",
  },
  disablePadding: {
    type: ["boolean"],
    defaultValue: String(initialSetup.disablePadding),
    description:
      "Used to disable panning, zooming boundary padding effect. By enabling this option, you will not be able to zoom outside the image area.",
  },
  customTransform: {
    type: ["function"],
    defaultValue: "undefined",
    description:
      "We can provide custom transform function to provide different way of handling our transform logic. If we need performance we can import getMatrixTransformStyles functions and replace default one. WARNING: default transform prevents svg blur on the safari.",
  },
  wheel: {
    wheel: {
      type: [""],
      defaultValue: "",
      description: "",
    },
    step: {
      type: ["number"],
      defaultValue: String(initialSetup.wheel.step),
      description: "The sensitivity of zooming with the wheel/touchpad.",
    },
    disabled: {
      type: ["boolean"],
      defaultValue: String(initialSetup.wheel.disabled),
      description:
        "Disable the mouse wheel and touchpad zooming functionalities, it will NOT affect pinching.",
    },
    wheelDisabled: {
      type: ["boolean"],
      defaultValue: String(initialSetup.wheel.wheelDisabled),
      description:
        "Disable only mouse wheel zooming functionality, it will NOT affect pinching and touchpad.",
    },
    touchPadDisabled: {
      type: ["boolean"],
      defaultValue: String(initialSetup.wheel.touchPadDisabled),
      description:
        "Disable only touchpad zooming functionality, it will NOT affect pinching and mouse wheel.",
    },
    activationKeys: {
      type: ["string[]"],
      defaultValue: String(initialSetup.wheel.activationKeys),
      description:
        "List of keys which, when held down, should activate this feature.",
    },
    excluded: {
      type: ["string[]"],
      defaultValue: String(initialSetup.wheel.excluded),
      description:
        "List of the class names or tags that should not activate this feature. (E.g. ['my-custom-class-name', 'div', 'a'])",
    },
  },
  panning: {
    panning: {
      type: [""],
      defaultValue: "",
      description: "",
    },
    disabled: {
      type: ["boolean"],
      defaultValue: String(initialSetup.panning.disabled),
      description: "Disable the panning feature.",
    },
    velocityDisabled: {
      type: ["boolean"],
      defaultValue: String(initialSetup.panning.velocityDisabled),
      description:
        "Disable the panning velocity feature. It's triggered when you release the mouse button so the content is still moving after it and slowing down with calculated time.",
    },
    lockAxisX: {
      type: ["string[]"],
      defaultValue: String(initialSetup.panning.activationKeys),
      description:
        "List of keys which, when held down, should activate this feature.",
    },
    lockAxisY: {
      type: ["string[]"],
      defaultValue: String(initialSetup.panning.activationKeys),
      description:
        "List of keys which, when held down, should activate this feature.",
    },
    activationKeys: {
      type: ["string[]"],
      defaultValue: String(initialSetup.panning.activationKeys),
      description:
        "List of keys which, when held down, should activate this feature.",
    },
    excluded: {
      type: ["string[]"],
      defaultValue: String(initialSetup.panning.excluded),
      description:
        "List of the class names or tags that should not activate this feature. (E.g. ['my-custom-class-name', 'div', 'a'])",
    },
  },
  pinch: {
    pinch: {
      type: [""],
      defaultValue: "",
      description: "",
    },
    step: {
      type: ["number"],
      defaultValue: String(initialSetup.pinch.step),
      description: "The sensitivity of zooming with the wheel/touchpad.",
    },
    disabled: {
      type: ["boolean"],
      defaultValue: String(initialSetup.pinch.disabled),
      description:
        "Disable the pinching zoom functionality, it will NOT affect mouse wheel/touchpad zooming.",
    },
    excluded: {
      type: ["string[]"],
      defaultValue: String(initialSetup.pinch.excluded),
      description:
        "List of the class names or tags that should not activate this feature. (E.g. ['my-custom-class-name', 'div', 'a'])",
    },
  },
  doubleClick: {
    doubleClick: {
      type: [""],
      defaultValue: "",
      description: "",
    },
    disabled: {
      type: ["boolean"],
      defaultValue: String(initialSetup.doubleClick.disabled),
      description: "Disable the double click feature.",
    },
    step: {
      type: ["number"],
      defaultValue: String(initialSetup.doubleClick.step),
      description:
        "The sensitivity of zooming in or out when the double click mode is set to 'zoomIn' or 'zoomOut'.",
    },
    mode: {
      type: ["zoomIn", "zoomOut", "reset"],
      defaultValue: String(initialSetup.doubleClick.mode),
      description:
        "The mode of the double click feature. Zoom in/Zoom out will change the scale with the given step settings. The reset functionality will take change transform to the initial values.",
    },
    animationTime: {
      type: ["number"],
      defaultValue: String(initialSetup.doubleClick.animationTime),
      description: "Time of the triggered double click animation.",
    },
    animationType: {
      type: Object.keys(animations),
      defaultValue: String(initialSetup.doubleClick.animationType),
      description: "Animations types to choose from.",
    },
    excluded: {
      type: ["string[]"],
      defaultValue: String(initialSetup.doubleClick.excluded),
      description:
        "List of the class names or tags that should not activate this feature. (E.g. ['my-custom-class-name', 'div', 'a'])",
    },
  },
  zoomAnimation: {
    zoomAnimation: {
      type: [""],
      defaultValue: "",
      description: "",
    },
    disabled: {
      type: ["boolean"],
      defaultValue: String(initialSetup.zoomAnimation.disabled),
      description: "Disable the double click feature.",
    },
    size: {
      type: ["number"],
      defaultValue: String(initialSetup.zoomAnimation.disabled),
      description:
        "Thanks to size, we can control the zoom out values larger than that controlled by the value of another 'minScale' prop. This results in an animated return of the value to the minimum scale when the zooming has finished. This works for both touchpad zooming and pinching.",
    },
    animationTime: {
      type: ["number"],
      defaultValue: String(initialSetup.zoomAnimation.animationTime),
      description: "Time of the triggered double click animation.",
    },
    animationType: {
      type: Object.keys(animations),
      defaultValue: String(initialSetup.zoomAnimation.animationType),
      description: "Animations types to choose from.",
    },
  },
  alignmentAnimation: {
    alignmentAnimation: {
      type: [""],
      defaultValue: "",
      description: "",
    },
    disabled: {
      type: ["boolean"],
      defaultValue: String(initialSetup.alignmentAnimation.disabled),
      description: "Disable the double click feature.",
    },
    sizeX: {
      type: ["number"],
      defaultValue: String(initialSetup.alignmentAnimation.sizeX),
      description:
        "Thanks to size, we can control the movement of our content component beyond the calculated limits. This results in an animation of a fallback to the closest accepted limits, however, this is only possible when the other 'limitToBounds' prop is set to true.",
    },
    sizeY: {
      type: ["number"],
      defaultValue: String(initialSetup.alignmentAnimation.sizeY),
      description:
        "Thanks to size, we can control the movement of our content component beyond the calculated limits. This results in an animation of a fallback to the closest accepted limits, however, this is only possible when the other 'limitToBounds' prop is set to true.",
    },
    velocityAlignmentTime: {
      type: ["number"],
      defaultValue: String(initialSetup.alignmentAnimation.animationTime),
      description:
        "Time of the velocity alignment animation. It is fired when acceleration begins when we are outside the wrapper limits (in the area defined by the above prop size)",
    },
    animationTime: {
      type: ["number"],
      defaultValue: String(initialSetup.alignmentAnimation.animationTime),
      description: "Time of the alignment animation.",
    },
    animationType: {
      type: Object.keys(animations),
      defaultValue: String(initialSetup.alignmentAnimation.animationType),
      description: "Animations types to choose from.",
    },
  },
  velocityAnimation: {
    velocityAnimation: {
      type: [""],
      defaultValue: "",
      description: "",
    },
    disabled: {
      type: ["boolean"],
      defaultValue: String(initialSetup.velocityAnimation.disabled),
      description: "Disable the double click feature.",
    },
    sensitivity: {
      type: ["number"],
      defaultValue: String(initialSetup.velocityAnimation.animationTime),
      description:
        "Additional variable that allows you to control the sensitivity of panning velocity",
    },
    animationTime: {
      type: ["number"],
      defaultValue: String(initialSetup.velocityAnimation.animationTime),
      description: "Time of the triggered double click animation.",
    },
    animationType: {
      type: Object.keys(animations),
      defaultValue: String(initialSetup.velocityAnimation.animationType),
      description: "Animations types to choose from.",
    },
    equalToMove: {
      type: ["boolean"],
      defaultValue: String(initialSetup.velocityAnimation.equalToMove),
      description:
        "The calculation of the velocity animation duration is adjusted to the length of the mouse movement",
    },
  },
  onWheelStart: {
    type: ["(ref: ReactZoomPanPinchRef, event) => void"],
    defaultValue: "undefined",
    description: "Callback fired when wheel/touchpad events are started",
  },
  onWheel: {
    type: ["(ref: ReactZoomPanPinchRef, event) => void"],
    defaultValue: "undefined",
    description: "Callback fired when wheel/touchpad events are ongoing",
  },
  onWheelStop: {
    type: ["(ref: ReactZoomPanPinchRef, event) => void"],
    defaultValue: "undefined",
    description: "Callback fired when wheel/touchpad events are finished",
  },
  onPanningStart: {
    type: ["(ref: ReactZoomPanPinchRef, event) => void"],
    defaultValue: "undefined",
    description: "Callback fired when panning event has started",
  },
  onPanning: {
    type: ["(ref: ReactZoomPanPinchRef, event) => void"],
    defaultValue: "undefined",
    description: "Callback fired when panning event is ongoing",
  },
  onPanningStop: {
    type: ["(ref: ReactZoomPanPinchRef, event) => void"],
    defaultValue: "undefined",
    description: "Callback fired when panning event has finished",
  },
  onPinchingStart: {
    type: ["(ref: ReactZoomPanPinchRef, event) => void"],
    defaultValue: "undefined",
    description: "Callback fired when pinch event has started",
  },
  onPinching: {
    type: ["(ref: ReactZoomPanPinchRef, event) => void"],
    defaultValue: "undefined",
    description: "Callback fired when pinch event is ongoing",
  },
  onPinchingStop: {
    type: ["(ref: ReactZoomPanPinchRef, event) => void"],
    defaultValue: "undefined",
    description: "Callback fired when pinch event has finished",
  },
  onZoomStart: {
    type: ["(ref: ReactZoomPanPinchRef, event) => void"],
    defaultValue: "undefined",
    description:
      "Callback fired when any of zoom events are started (wheel/touchpad/pinch)",
  },
  onZoom: {
    type: ["(ref: ReactZoomPanPinchRef, event) => void"],
    defaultValue: "undefined",
    description:
      "Callback fired when any of zoom events are ongoing (wheel/touchpad/pinch)",
  },
  onZoomStop: {
    type: ["(ref: ReactZoomPanPinchRef, event) => void"],
    defaultValue: "undefined",
    description:
      "Callback fired when any of zoom events are finished (wheel/touchpad/pinch)",
  },
  onTransformed: {
    type: [
      "(ref: ReactZoomPanPinchRef, scale: number, positionX: number, positionY: number ) => void",
    ],
    defaultValue: "undefined",
    description: "Callback fired when on each transform",
  },
  onInit: {
    type: ["(ref: ReactZoomPanPinchRef) => void"],
    defaultValue: "undefined",
    description: "Callback fired when components get mounted",
  },
};

export const componentProps = getPropsTable(componentPropsTable);
export const wrapperProps = getPropsTable(wrapperPropsTable);
