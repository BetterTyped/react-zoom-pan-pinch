import { initialSetup } from "../../constants/state.constants";

export const argsTypes = {
  wheel: {
    table: {
      disable: true,
    },
  },
  "wheel.step": {
    defaultValue: initialSetup.wheel.step,
    control: {
      type: "number",
      min: 0,
    },
    table: {
      defaultValue: { summary: "0" },
    },
  },
  "wheel.disabled": {
    defaultValue: initialSetup.wheel.disabled,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "wheel.wheelDisabled": {
    defaultValue: initialSetup.wheel.wheelDisabled,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "wheel.touchPadDisabled": {
    defaultValue: initialSetup.wheel.touchPadDisabled,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "wheel.activationKeys": {
    defaultValue: initialSetup.wheel.activationKeys,
    control: { type: "text" },
    table: {
      defaultValue: { summary: "" },
      type: { summary: "string" },
    },
  },
  "wheel.excluded": {
    defaultValue: initialSetup.wheel.excluded,
    control: { type: "array" },
    table: {
      defaultValue: { summary: "" },
      type: { summary: "array" },
    },
  },
  panning: {
    table: {
      disable: true,
    },
  },
  "panning.disabled": {
    defaultValue: initialSetup.panning.disabled,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "panning.velocityDisabled": {
    defaultValue: initialSetup.panning.velocityDisabled,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "panning.lockAxisX": {
    defaultValue: initialSetup.panning.lockAxisX,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "panning.lockAxisY": {
    defaultValue: initialSetup.panning.lockAxisY,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "panning.activationKeys": {
    defaultValue: initialSetup.panning.activationKeys,
    control: { type: "text" },
    table: {
      defaultValue: { summary: "" },
      type: { summary: "string" },
    },
  },
  "panning.excluded": {
    defaultValue: initialSetup.panning.excluded,
    control: { type: "array" },
    table: {
      defaultValue: { summary: "" },
      type: { summary: "array" },
    },
  },
  pinch: {
    table: {
      disable: true,
    },
  },
  "pinch.step": {
    defaultValue: initialSetup.pinch.step,
    control: {
      type: "number",
      min: 0,
    },
    table: {
      defaultValue: { summary: "0" },
    },
  },
  "pinch.disabled": {
    defaultValue: initialSetup.pinch.disabled,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "pinch.excluded": {
    defaultValue: initialSetup.pinch.excluded,
    control: { type: "array" },
    table: {
      defaultValue: { summary: "" },
      type: { summary: "array" },
    },
  },
  doubleClick: {
    table: {
      disable: true,
    },
  },
  "doubleClick.step": {
    defaultValue: initialSetup.doubleClick.step,
    control: {
      type: "number",
      min: 0,
    },
    table: {
      defaultValue: { summary: "0" },
    },
  },
  "doubleClick.disabled": {
    defaultValue: initialSetup.doubleClick.disabled,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "doubleClick.excluded": {
    defaultValue: initialSetup.doubleClick.excluded,
    control: { type: "array" },
    table: {
      defaultValue: { summary: "" },
      type: { summary: "array" },
    },
  },
};
// doubleClick: {
//   disabled: false,
//   step: 20,
//   mode: "zoomIn",
//   animation: true,
//   animationType: "easeOut",
//   animationTime: 200,
// },
// zoomAnimation: {
//   disabled: false,
//   size: 0.4,
//   animationTime: 200,
//   animationType: "easeOut",
// },
// alignmentAnimation: {
//   disabled: false,
//   size: 30,
//   animationTime: 200,
//   animationType: "easeOut",
// },
// velocityAnimation: {
//   disabled: false,
//   sensitivity: 1,
//   animationTime: 600,
//   animationType: "easeOut",
//   equalToMove: true,
// },
