import React from "react";
import PropTypes from "prop-types";
import { reducer, initialState } from "./StateReducer";
import { SET_SCALE, SET_SENSITIVITY, SET_POSITION_X, SET_POSITION_Y } from "./CONSTANTS";

const Context = React.createContext({});

function roundNumber(num, decimal = 5) {
  return Number(num.toFixed(decimal));
}

function checkIsNumber(num, defaultValue) {
  return typeof num === "number" ? num : defaultValue;
}

function boundLimiter(value, minBound, maxBound, isActive) {
  if (!isActive) return value;
  if (value < minBound) return minBound;
  if (value > maxBound) return maxBound;
  return value;
}

const defaultCoords = { x: 0, y: 0 };

const StateProvider = ({ children }) => {
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let [wrapperComponent, setWrapperComponent] = React.useState(null);
  let [contentComponent, setContentComponent] = React.useState(null);
  let [startCoords, setStartCoords] = React.useState(defaultCoords);
  let [isDown, setIsDown] = React.useState(false);

  const { positionX, positionY, scale, sensitivity, maxScale, minScale, limitToBounds } = state;

  function relativeCoords(event, wrapper, content) {
    const x = event ? event.pageX - wrapper.offsetTop : 0;
    const y = event ? event.pageY - wrapper.offsetLeft : 0;
    const wrapperWidth = wrapper.offsetWidth;
    const wrapperHeight = wrapper.offsetHeight;
    const contentRect = content.getBoundingClientRect();
    const contentWidth = contentRect.width;
    const contentHeight = contentRect.height;
    const diffHeight = wrapperHeight - contentHeight;
    const diffWidth = wrapperWidth - contentWidth;
    return {
      x,
      y,
      wrapperWidth,
      wrapperHeight,
      contentWidth,
      contentHeight,
      diffHeight,
      diffWidth,
    };
  }

  function handleZoom(event, wrapper, content, setCenterClick, customDelta, customSensitivity) {
    if (isDown) return;
    const {
      x,
      y,
      wrapperWidth,
      wrapperHeight,
      diffHeight,
      diffWidth,
      contentWidth,
      contentHeight,
    } = relativeCoords(event, wrapper, content);

    const deltaY = event ? (event.deltaY < 0 ? 1 : -1) : 0;
    const delta = checkIsNumber(customDelta, deltaY);
    // Mouse position
    const mouseX = setCenterClick ? wrapperWidth / 2 : x;
    const mouseY = setCenterClick ? wrapperHeight / 2 : y;

    // Determine new zoomed in point
    const targetX = (mouseX - positionX) / scale;
    const targetY = (mouseY - positionY) / scale;

    const zoomSensitivityFactor = checkIsNumber(customSensitivity, 0.1);

    // Calculate new zoom
    let newScale = scale + delta * (sensitivity * zoomSensitivityFactor) * scale;
    if (newScale >= maxScale && scale < maxScale) {
      newScale = maxScale;
    }
    if (newScale <= minScale && scale > minScale) {
      newScale = minScale;
    }
    if (newScale > maxScale || newScale < minScale) return;
    setScale(newScale);

    // Calculate new positions
    const newPositionX = -targetX * newScale + mouseX;
    const newPositionY = -targetY * newScale + mouseY;

    // Calculate bounding area
    const scaleWidthFactor = wrapperWidth > contentWidth ? diffWidth : 0;
    const scaleHeightFactor = wrapperHeight > contentHeight ? diffHeight : 0;

    const minPositionX = wrapperWidth - contentWidth - scaleWidthFactor;
    const maxPositionX = 0 + scaleWidthFactor;
    const minPositionY = wrapperHeight - contentHeight - scaleHeightFactor;
    const maxPositionY = 0 + scaleHeightFactor;

    setPositionX(boundLimiter(newPositionX, minPositionX, maxPositionX, limitToBounds));
    setPositionY(boundLimiter(newPositionY, minPositionY, maxPositionY, limitToBounds));
  }

  function handleStartPanning(event) {
    if (isDown) return;
    const { x, y } = relativeCoords(event, wrapperComponent, contentComponent);
    setStartCoords({
      x: x - positionX,
      y: y - positionY,
    });
    setIsDown(true);
  }

  function handlePanning(event) {
    if (!isDown) return;
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
    const scaleWidthFactor = wrapperWidth > contentWidth ? diffWidth : 0;
    const scaleHeightFactor = wrapperHeight > contentHeight ? diffHeight : 0;

    const minPositionX = wrapperWidth - contentWidth - scaleWidthFactor;
    const maxPositionX = 0 + scaleWidthFactor;
    const minPositionY = wrapperHeight - contentHeight - scaleHeightFactor;
    const maxPositionY = 0 + scaleHeightFactor;

    setPositionX(boundLimiter(newPositionX, minPositionX, maxPositionX, limitToBounds));
    setPositionY(boundLimiter(newPositionY, minPositionY, maxPositionY, limitToBounds));
  }

  function handleStopPanning() {
    setIsDown(false);
  }

  function setScale(scale) {
    dispatch({ type: SET_SCALE, scale: roundNumber(scale, 2) });
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
  function zoomIn(customSensitivity) {
    handleZoom(
      null,
      wrapperComponent,
      contentComponent,
      true,
      1,
      checkIsNumber(customSensitivity, state.zoomSensitivity)
    );
  }

  function zoomOut(customSensitivity) {
    handleZoom(
      null,
      wrapperComponent,
      contentComponent,
      true,
      -1,
      checkIsNumber(customSensitivity, state.zoomSensitivity)
    );
  }

  function setTransform(scale, positionX, positionY) {
    setScale(scale);
    setPositionX(positionX);
    setPositionY(positionY);
  }

  function resetTransform(defaultScale, defaultPositionX, defaultPositionY) {
    setScale(checkIsNumber(defaultScale, initialState.scale));
    setPositionX(checkIsNumber(defaultPositionX, initialState.positionX));
    setPositionY(checkIsNumber(defaultPositionY, initialState.positionY));
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
