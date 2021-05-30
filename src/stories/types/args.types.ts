export const argsTypes = {
  wheel: {
    table: {
      disable: true,
    },
  },
  "wheel.step": {
    defaultValue: 0.1,
    control: {
      type: "number",
      min: 0,
    },
    table: {
      defaultValue: { summary: "0" },
    },
  },
  "wheel.disabled": {
    defaultValue: false,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "wheel.wheelDisabled": {
    defaultValue: false,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "wheel.touchPadDisabled": {
    defaultValue: false,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "wheel.activationKeys": {
    defaultValue: "",
    control: { type: "text" },
    table: {
      defaultValue: { summary: "" },
      type: { summary: "string" },
    },
  },
  "wheel.excluded": {
    defaultValue: [],
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
    defaultValue: false,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "panning.velocityDisabled": {
    defaultValue: false,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "panning.lockAxisX": {
    defaultValue: false,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "panning.lockAxisY": {
    defaultValue: false,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "panning.activationKeys": {
    defaultValue: "",
    control: { type: "text" },
    table: {
      defaultValue: { summary: "" },
      type: { summary: "string" },
    },
  },
  "panning.excluded": {
    defaultValue: [],
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
    defaultValue: 5,
    control: {
      type: "number",
      min: 0,
    },
    table: {
      defaultValue: { summary: "0" },
    },
  },
  "pinch.disabled": {
    defaultValue: false,
    control: { type: "boolean" },
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  "pinch.excluded": {
    defaultValue: [],
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
