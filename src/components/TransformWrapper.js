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
  zoomOutSensitivity,
  zoomInSensitivity,
  dbClickSensitivity,
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
}) => {
  return (
    <StateProvider
      defaultValues={deleteUndefinedProps({
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
        zoomOutSensitivity,
        zoomInSensitivity,
        dbClickSensitivity,
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
  zoomOutSensitivity: PropTypes.bool,
  zoomInSensitivity: PropTypes.bool,
  dbClickSensitivity: PropTypes.bool,
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
};

export default TransformWrapper;
