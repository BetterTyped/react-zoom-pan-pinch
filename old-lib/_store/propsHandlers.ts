export const propsList = [
  "previousScale",
  "scale",
  "positionX",
  "positionY",
  "defaultPositionX",
  "defaultPositionY",
  "defaultScale",
  "onWheelStart",
  "onWheel",
  "onWheelStop",
  "onPanningStart",
  "onPanning",
  "onPanningStop",
  "onPinchingStart",
  "onPinching",
  "onPinchingStop",
  "onZoomChange",
  "options",
  "wheel",
  "scalePadding",
  "pan",
  "pinch",
  "zoomIn",
  "zoomOut",
  "doubleClick",
  "reset",
];

export const getValidPropsFromObject = props => {
  return Object.keys(props).reduce((acc, key) => {
    if (propsList.includes(key)) {
      acc[key] = props[key];
    }
    return acc;
  }, {});
};
