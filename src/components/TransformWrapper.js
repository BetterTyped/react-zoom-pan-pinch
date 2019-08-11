import React from "react";
import PropTypes from "prop-types";
import { StateProvider } from "../store/StateContext";
import { deleteInvalidProps } from "../store/utils";

const TransformWrapper = ({
  children,
  scale,
  positionX,
  positionY,
  sensitivity,
  maxScale,
  minScale,
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
}) => {
  return (
    <StateProvider
      defaultValues={deleteInvalidProps({
        scale,
        positionX,
        positionY,
        sensitivity,
        maxScale,
        minScale,
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
};

export default TransformWrapper;
