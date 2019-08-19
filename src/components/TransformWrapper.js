import React from "react";
import PropTypes from "prop-types";
import { StateProvider } from "../store/StateContext";
import { deleteUndefinedProps } from "../store/utils";

const TransformWrapper = ({
  children,
  scale,
  positionX,
  positionY,
  sensitivity,
  maxScale,
  minScale,
  wheelAnimationSpeed,
  zoomAnimationSpeed,
  pinchAnimationSpeed,
  panAnimationSpeed,
  resetAnimationSpeed,
  minPositionX,
  minPositionY,
  maxPositionX,
  maxPositionY,
  limitToBounds,
  zoomingEnabled,
  panningEnabled,
  transformEnabled,
  pinchEnabled,
  enableZoomedOutPanning,
  disabled,
  zoomOutStep,
  zoomInStep,
  dbClickStep,
  pinchSensitivity,
  dbClickEnabled,
  lastPositionZoomEnabled,
  enableZoomThrottling,
  onWheelStart,
  onWheel,
  onWheelStop,
  onPanningStart,
  onPanning,
  onPanningStop,
  onPinchingStart,
  onPinching,
  onPinchingStop,
  defaultPositionX,
  defaultPositionY,
  defaultScale,
}) => {
  return (
    <StateProvider
      defaultValues={deleteUndefinedProps({
        defaultPositionX,
        defaultPositionY,
        defaultScale,
      })}
      dynamicValues={deleteUndefinedProps({
        scale,
        positionX,
        positionY,
        sensitivity,
        maxScale,
        minScale,
        wheelAnimationSpeed,
        zoomAnimationSpeed,
        pinchAnimationSpeed,
        panAnimationSpeed,
        resetAnimationSpeed,
        minPositionX,
        minPositionY,
        maxPositionX,
        maxPositionY,
        limitToBounds,
        zoomingEnabled,
        panningEnabled,
        transformEnabled,
        pinchEnabled,
        enableZoomedOutPanning,
        disabled,
        zoomOutStep,
        zoomInStep,
        dbClickStep,
        pinchSensitivity,
        dbClickEnabled,
        lastPositionZoomEnabled,
        enableZoomThrottling,
      })}
      onWheelStart={onWheelStart}
      onWheel={onWheel}
      onWheelStop={onWheelStop}
      onPanningStart={onPanningStart}
      onPanning={onPanning}
      onPanningStop={onPanningStop}
      onPinchingStart={onPinchingStart}
      onPinching={onPinching}
      onPinchingStop={onPinchingStop}
    >
      {children}
    </StateProvider>
  );
};

TransformWrapper.propTypes = {
  children: PropTypes.any,
  scale: PropTypes.number,
  positionX: PropTypes.number,
  positionY: PropTypes.number,
  sensitivity: PropTypes.number,
  maxScale: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  minScale: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  wheelAnimationSpeed: PropTypes.number,
  zoomAnimationSpeed: PropTypes.number,
  pinchAnimationSpeed: PropTypes.number,
  panAnimationSpeed: PropTypes.number,
  resetAnimationSpeed: PropTypes.number,
  minPositionX: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  maxPositionX: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  minPositionY: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  maxPositionY: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  limitToBounds: PropTypes.bool,
  zoomingEnabled: PropTypes.bool,
  panningEnabled: PropTypes.bool,
  transformEnabled: PropTypes.bool,
  pinchEnabled: PropTypes.bool,
  enableZoomedOutPanning: PropTypes.bool,
  disabled: PropTypes.bool,
  zoomOutStep: PropTypes.bool,
  zoomInStep: PropTypes.bool,
  dbClickStep: PropTypes.bool,
  pinchSensitivity: PropTypes.bool,
  dbClickEnabled: PropTypes.bool,
  lastPositionZoomEnabled: PropTypes.bool,
  enableZoomThrottling: PropTypes.bool,
  onWheelStart: PropTypes.func,
  onWheel: PropTypes.func,
  onWheelStop: PropTypes.func,
  onPanningStart: PropTypes.func,
  onPanning: PropTypes.func,
  onPanningStop: PropTypes.func,
  onPinchingStart: PropTypes.func,
  onPinching: PropTypes.func,
  onPinchingStop: PropTypes.func,
  defaultPositionX: PropTypes.number,
  defaultPositionY: PropTypes.number,
  defaultScale: PropTypes.number,
};

export default TransformWrapper;
