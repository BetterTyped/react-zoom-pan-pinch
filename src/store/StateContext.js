import React, { useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { reducer, initialState } from "./StateReducer";
import { SET_SCALE, SET_SENSITIVITY, SET_POSITION_X, SET_POSITION_Y } from "./CONSTANTS";
import {
  roundNumber,
  checkIsNumber,
  boundLimiter,
  relativeCoords,
  calculateBoundingArea,
  touchDistance,
  midpoint,
  clamp,
  touchPt,
  coordChange,
} from "./utils";
import makePassiveEventOption from "./makePassiveEventOption";

const Context = React.createContext({});

const defaultCoords = { x: 0, y: 0 };

const StateProvider = ({ children }) => {
  let [state, dispatch] = useReducer(reducer, initialState);
  let [wrapperComponent, setWrapperComponent] = useState(null);
  let [contentComponent, setContentComponent] = useState(null);
  let [startCoords, setStartCoords] = useState(defaultCoords);
  let [isDown, setIsDown] = useState(false);
  let [isScaling, setIsScaling] = useState(false);
  let [distanceStart, setDistanceStart] = useState(false);

  const {
    positionX,
    positionY,
    scale,
    sensitivity,
    maxScale,
    minScale,
    limitToBounds,
    zoomingEnabled,
    panningEnabled,
    transformEnabled,
    pinchEnabled,
    enableZoomedOutPanning,
    disabled,
  } = state;

  useEffect(() => {
    const passiveOption = makePassiveEventOption(false);

    // Add touch screen events
    // this.containerNode.addEventListener("touchstart", handlePinchStart, passiveOption);
    // window.addEventListener("touchmove", handlePinch, passiveOption);
    // window.addEventListener("touchend", handlePinchStop, passiveOption);

    // Add events for devices with mice
    // this.containerNode.addEventListener("mousedown", this.onMouseDown, passiveOption);
    // window.addEventListener("mousemove", this.onMouseMove, passiveOption);
    // window.addEventListener("mouseup", this.onMouseUp, passiveOption);
  }, [contentComponent]);

  function setTransform(scale, positionX, positionY) {
    if (!transformEnabled || disabled) return;
    setScale(scale);
    setPositionX(positionX);
    setPositionY(positionY);
  }

  function resetTransform(defaultScale, defaultPositionX, defaultPositionY) {
    if (!transformEnabled || disabled) return;
    setScale(checkIsNumber(defaultScale, initialState.scale));
    setPositionX(checkIsNumber(defaultPositionX, initialState.positionX));
    setPositionY(checkIsNumber(defaultPositionY, initialState.positionY));
  }

  //////////
  // Zooming
  //////////

  function handleZoom(event, setCenterClick, customDelta, customSensitivity) {
    if (isDown || !zoomingEnabled || disabled) return;
    event.preventDefault();
    event.stopPropagation();
    const { x, y, wrapperWidth, wrapperHeight } = relativeCoords(
      event,
      wrapperComponent,
      contentComponent
    );

    const deltaY = event ? (event.deltaY < 0 ? 1 : -1) : 0;
    const delta = checkIsNumber(customDelta, deltaY);
    // Mouse position
    const mouseX = setCenterClick ? wrapperWidth / 2 : x;
    const mouseY = setCenterClick ? wrapperHeight / 2 : y;

    // Determine new zoomed in point
    const targetX = (mouseX - positionX) / scale;
    const targetY = (mouseY - positionY) / scale;

    const zoomSensitivity = (customSensitivity || sensitivity) * 0.1;

    // Calculate new zoom
    let newScale = roundNumber(scale + delta * zoomSensitivity * scale, 2);

    if (newScale >= maxScale && scale < maxScale) {
      newScale = maxScale;
    }
    if (newScale <= minScale && scale > minScale) {
      newScale = minScale;
    }
    if (newScale > maxScale || newScale < minScale) return;

    const newContentWidth = wrapperWidth * newScale;
    const newContentHeight = wrapperHeight * newScale;

    const newDiffWidth = wrapperWidth - newContentWidth;
    const newDiffHeight = wrapperHeight - newContentHeight;

    // Calculate bounding area
    const { minPositionX, maxPositionX, minPositionY, maxPositionY } = calculateBoundingArea(
      wrapperWidth,
      newContentWidth,
      newDiffWidth,
      wrapperHeight,
      newContentHeight,
      newDiffHeight,
      enableZoomedOutPanning
    );

    setScale(newScale);

    // Calculate new positions
    const newPositionX = -targetX * newScale + mouseX;
    const newPositionY = -targetY * newScale + mouseY;

    setPositionX(boundLimiter(newPositionX, minPositionX, maxPositionX, limitToBounds));
    setPositionY(boundLimiter(newPositionY, minPositionY, maxPositionY, limitToBounds));
  }

  //////////
  // Panning
  //////////

  function handleStartPanning(event) {
    if (isDown || !panningEnabled || disabled) return;
    const { x, y } = relativeCoords(event, wrapperComponent, contentComponent);
    setStartCoords({
      x: x - positionX,
      y: y - positionY,
    });
    setIsDown(true);
  }

  function handlePanning(event) {
    if (!isDown || !panningEnabled || disabled) return;
    const {
      x,
      y,
      wrapperWidth,
      wrapperHeight,
      contentWidth,
      contentHeight,
      diffWidth,
      diffHeight,
    } = relativeCoords(event, wrapperComponent, contentComponent);
    const newPositionX = x - startCoords.x;
    const newPositionY = y - startCoords.y;

    // Calculate bounding area
    const { minPositionX, maxPositionX, minPositionY, maxPositionY } = calculateBoundingArea(
      wrapperWidth,
      contentWidth,
      diffWidth,
      wrapperHeight,
      contentHeight,
      diffHeight,
      enableZoomedOutPanning
    );

    setPositionX(boundLimiter(newPositionX, minPositionX, maxPositionX, limitToBounds));
    setPositionY(boundLimiter(newPositionY, minPositionY, maxPositionY, limitToBounds));
  }

  function handleStopPanning() {
    if (!panningEnabled || disabled) return;
    setIsDown(false);
  }

  //////////
  // Pinching
  //////////

  function handlePinchStart(event) {
    if (event.touches.length === 2) {
      setIsScaling(true);
    }
  }

  function handlePinch(event) {}

  function handlePinchStop() {
    if (isScaling) {
      setIsScaling(false);
    }
  }

  //////////
  // Setters
  //////////

  function setScale(scale) {
    if (scale > maxScale || scale < minScale) return;
    dispatch({ type: SET_SCALE, scale: scale });
  }

  function setPositionX(positionX) {
    const { minPositionX, maxPositionX } = state;
    if ((minPositionX && positionX < minPositionX) || (maxPositionX && positionX > maxPositionX))
      return;
    dispatch({ type: SET_POSITION_X, positionX: roundNumber(positionX, 3) });
  }

  function setPositionY(positionY) {
    const { minPositionY, maxPositionY } = state;
    if ((minPositionY && positionY < minPositionY) || (maxPositionY && positionY > maxPositionY))
      return;
    dispatch({ type: SET_POSITION_Y, positionY: roundNumber(positionY, 3) });
  }

  function setSensitivity(sensitivity) {
    dispatch({ type: SET_SENSITIVITY, sensitivity: roundNumber(sensitivity, 2) });
  }

  //////////
  // Controls
  //////////

  function zoomIn(event) {
    if (!zoomingEnabled || disabled) return;
    handleZoom(event, true, 1, state.zoomInSensitivity);
  }

  function zoomOut(event) {
    if (!zoomingEnabled || disabled) return;
    handleZoom(event, true, -1, state.zoomOutSensitivity);
  }

  function handleDbClick(event) {
    if (!zoomingEnabled || disabled) return;
    //todo debug
    handleZoom(event, false, 1, state.dbSensitivity);
  }

  const value = {
    state,
    dispatch: {
      setSensitivity,
      setScale,
      setPositionX,
      setPositionY,
      zoomIn,
      zoomOut,
      setTransform,
      resetTransform,
    },
    nodes: {
      setWrapperComponent,
      setContentComponent,
    },
    internal: {
      handleZoom,
      handleStartPanning,
      handlePanning,
      handleStopPanning,
      handleDbClick,
      handlePinchStart,
      handlePinch,
      handlePinchStop,
    },
  };

  const content =
    typeof children === "function" ? children({ ...value.state, ...value.dispatch }) : children;

  return <Context.Provider value={value}>{content}</Context.Provider>;
};

StateProvider.propTypes = {
  children: PropTypes.any,
};

export { Context, StateProvider };
