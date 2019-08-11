import React, { Component } from "react";
import PropTypes from "prop-types";
import { reducer, initialState } from "./StateReducer";
import {
  SET_SCALE,
  SET_POSITION_X,
  SET_POSITION_Y,
  SET_WRAPPER,
  SET_CONTENT,
  SET_START_COORDS,
  SET_IS_DOWN,
  SET_DISTANCE,
} from "./CONSTANTS";
import {
  roundNumber,
  checkIsNumber,
  boundLimiter,
  relativeCoords,
  calculateBoundingArea,
  getMiddleCoords,
  getDistance,
  getRelativeZoomCoords,
  getLastPositionZoomCoords,
  handleCallback,
} from "./utils";
import makePassiveEventOption from "./makePassiveEventOption";

const Context = React.createContext({});
let timer = null;
const timerTime = 100;
let throttle = false;
const throttleTime = 1;

class StateProvider extends Component {
  state = {
    ...initialState,
    ...this.props.defaultValues,
    lastMouseEventPosition: null,
    previousScale: initialState.scale,
    eventType: false,
  };

  componentDidMount() {
    const passiveOption = makePassiveEventOption(false);

    // Panning on window to allow panning when mouse is out of wrapper
    window.addEventListener("mousedown", this.handleStartPanning, passiveOption);
    window.addEventListener("mousemove", this.handlePanning, passiveOption);
    window.addEventListener("mouseup", this.handleStopPanning, passiveOption);
    return () => {
      window.removeEventListener("mousedown", this.handleStartPanning, passiveOption);
      window.removeEventListener("mousemove", this.handlePanning, passiveOption);
      window.removeEventListener("mouseup", this.handleStopPanning, passiveOption);
    };
  }

  componentDidUpdate(oldProps, oldState) {
    const { wrapperComponent } = this.state;
    if (!oldState.wrapperComponent && this.state.wrapperComponent) {
      // Zooming events on wrapper
      const passiveOption = makePassiveEventOption(false);
      wrapperComponent.addEventListener("wheel", this.handleWheel, passiveOption);
      wrapperComponent.addEventListener("dblclick", this.handleDbClick, passiveOption);
      wrapperComponent.addEventListener("touchstart", this.handlePinchStart, passiveOption);
      wrapperComponent.addEventListener("touchmove", this.handlePinch, passiveOption);
      wrapperComponent.addEventListener("touchend", this.handlePinchStop, passiveOption);
    }
  }

  //////////
  // Zooming
  //////////

  handleZoom = (event, setCenterClick, customDelta, customSensitivity) => {
    event.preventDefault();
    event.stopPropagation();
    const {
      isDown,
      zoomingEnabled,
      disabled,
      wrapperComponent,
      contentComponent,
      positionX,
      positionY,
      scale,
      sensitivity,
      maxScale,
      minScale,
      enableZoomedOutPanning,
      limitToBounds,
      enableZoomThrottling,
    } = this.state;
    if (throttle && enableZoomThrottling) return;
    if (isDown || !zoomingEnabled || disabled) return;
    const {
      x,
      y,
      zoomInX,
      zoomInY,
      zoomOutX,
      zoomOutY,
      wrapperWidth,
      wrapperHeight,
    } = relativeCoords(event, wrapperComponent, contentComponent);

    const deltaY = event ? (event.deltaY < 0 ? 1 : -1) : 0;
    const delta = checkIsNumber(customDelta, deltaY);
    const zoomSensitivity = (customSensitivity || sensitivity) * 0.1;

    // Calculate new zoom
    let newScale = roundNumber(scale + delta * zoomSensitivity * scale, 2);

    if (!isNaN(maxScale) && newScale >= maxScale && scale < maxScale) {
      newScale = maxScale;
    }
    if (!isNaN(minScale) && newScale <= minScale && scale > minScale) {
      newScale = minScale;
    }
    if ((!isNaN(maxScale) && !isNaN(minScale) && newScale > maxScale) || newScale < minScale)
      return;

    const scaleDifference = newScale - scale;

    // Mouse position
    const mouseX = checkIsNumber(setCenterClick && setCenterClick.x, x / scale);
    const mouseY = checkIsNumber(setCenterClick && setCenterClick.y, y / scale);

    if (isNaN(mouseX) || isNaN(mouseY)) return console.warn("No mouse or touch offset found");

    // Bounding area details
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
    this.setState({ previousScale: scale, lastMouseEventPosition: { x: mouseX, y: mouseY } });
    this.setScale(newScale);

    // Calculate new positions
    let newPositionX = -(mouseX * scaleDifference) + positionX;
    let newPositionY = -(mouseY * scaleDifference) + positionY;

    this.setPositionX(boundLimiter(newPositionX, minPositionX, maxPositionX, limitToBounds));
    this.setPositionY(boundLimiter(newPositionY, minPositionY, maxPositionY, limitToBounds));

    // throttle
    throttle = true;
    setTimeout(() => {
      throttle = false;
    }, throttleTime);
  };

  //////////
  // Wheel
  //////////

  handleWheel = event => {
    // Wheel start event
    if (!timer) {
      this.setState({ eventType: "wheel" });
      handleCallback(this.props.onWheelStart, this.getCallbackProps());
    }

    //Wheel event
    this.handleZoom(event);
    handleCallback(this.props.onWheel, this.getCallbackProps());

    // Wheel stop event
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleCallback(this.props.onWheelStop, this.getCallbackProps());
      this.setState(p => ({ eventType: p.eventType === "wheel" ? false : p.eventType }));
      timer = null;
    }, timerTime);
  };

  //////////
  // Panning
  //////////

  handleStartPanning = event => {
    const {
      isDown,
      panningEnabled,
      disabled,
      wrapperComponent,
      contentComponent,
      positionX,
      positionY,
    } = this.state;
    const { target } = event;
    if (
      isDown ||
      !panningEnabled ||
      disabled ||
      !wrapperComponent.contains(target) ||
      (event.touches && event.touches.length !== 1)
    )
      return;
    let points;
    if (!event.touches) {
      points = relativeCoords(event, wrapperComponent, contentComponent, true);
    } else {
      points = getMiddleCoords(event.touches[0], event.touches[0], wrapperComponent);
    }
    this.setState({
      eventType: "pan",
    });
    this.setStartCoords({
      x: points.x - positionX,
      y: points.y - positionY,
    });
    this.setIsDown(true);
    handleCallback(this.props.onPanningStart, this.getCallbackProps());
  };

  handlePanning = event => {
    const {
      isDown,
      panningEnabled,
      disabled,
      wrapperComponent,
      contentComponent,
      startCoords,
      enableZoomedOutPanning,
      limitToBounds,
    } = this.state;
    if (!isDown || !panningEnabled || disabled || (event.touches && event.touches.length !== 1))
      return;
    const {
      x,
      y,
      wrapperWidth,
      wrapperHeight,
      contentWidth,
      contentHeight,
      diffWidth,
      diffHeight,
    } = relativeCoords(event, wrapperComponent, contentComponent, true);
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
    this.setPositionX(boundLimiter(newPositionX, minPositionX, maxPositionX, limitToBounds));
    this.setPositionY(boundLimiter(newPositionY, minPositionY, maxPositionY, limitToBounds));
    handleCallback(this.props.onPanning, this.getCallbackProps());
  };

  handleStopPanning = () => {
    const { isDown, wrapperComponent, contentComponent, scale, positionX, positionY } = this.state;
    this.setIsDown(false);
    if (isDown) {
      const { x, y } = getRelativeZoomCoords({
        wrapperComponent,
        contentComponent,
        scale,
        positionX,
        positionY,
      });
      this.setState(p => ({
        lastMouseEventPosition: { x, y },
        eventType: p.eventType === "pan" ? false : p.eventType,
      }));
      handleCallback(this.props.onPanningStop, this.getCallbackProps());
    }
  };

  //////////
  // Pinching
  //////////

  handlePinchStart = event => {
    this.handleStartPanning(event);
    event.preventDefault();
    event.stopPropagation();
    this.setState({ eventType: "pinch" });
    handleCallback(this.props.onPinchingStart, this.getCallbackProps());
  };

  handlePinch = event => {
    const { distance, pinchSensitivity, pinchEnabled, disabled, wrapperComponent } = this.state;
    this.handlePanning(event);
    if (event.touches.length >= 2) {
      this.handleStopPanning();
    }
    if (pinchEnabled && event.touches.length >= 2 && !disabled) {
      let length = getDistance(event.touches[0], event.touches[1]);
      this.setDistance(length);
    }
    if (isNaN(distance) || event.touches.length !== 2 || !pinchEnabled || disabled) return;
    let length = getDistance(event.touches[0], event.touches[1]);
    this.handleZoom(
      event,
      getMiddleCoords(event.touches[0], event.touches[1], wrapperComponent),
      distance < length ? 1 : -1,
      pinchSensitivity
    );
    handleCallback(this.props.onPinching, this.getCallbackProps());
  };

  handlePinchStop = () => {
    const { distance } = this.state;
    this.handleStopPanning();
    if (!isNaN(distance)) {
      this.setDistance(false);
    }
    this.setState(p => ({ eventType: p.eventType === "pinch" ? false : p.eventType }));
    handleCallback(this.props.onPinchingStop, this.getCallbackProps());
  };

  //////////
  // Controls
  //////////

  resetLastMousePosition = () => this.setState({ lastMouseEventPosition: null });

  zoomIn = event => {
    const {
      zoomingEnabled,
      disabled,
      zoomInSensitivity,
      scale,
      lastMouseEventPosition,
      previousScale,
      lastPositionZoomEnabled,
    } = this.state;
    if (!event) return console.error("Zoom in function require event prop");
    if (!zoomingEnabled || disabled) return;
    const zoomCoords = getLastPositionZoomCoords({
      resetLastMousePosition: this.resetLastMousePosition,
      lastPositionZoomEnabled,
      lastMouseEventPosition,
      previousScale,
      scale,
    });
    this.handleZoom(event, zoomCoords, 1, zoomInSensitivity);
  };

  zoomOut = event => {
    const {
      zoomingEnabled,
      disabled,
      zoomOutSensitivity,
      scale,
      lastMouseEventPosition,
      previousScale,
      lastPositionZoomEnabled,
    } = this.state;
    if (!event) return console.error("Zoom out function require event prop");
    if (!zoomingEnabled || disabled) return;
    const zoomCoords = getLastPositionZoomCoords({
      resetLastMousePosition: this.resetLastMousePosition,
      lastPositionZoomEnabled,
      lastMouseEventPosition,
      previousScale,
      scale,
    });
    this.handleZoom(event, zoomCoords, -1, zoomOutSensitivity);
  };

  handleDbClick = event => {
    const {
      zoomingEnabled,
      disabled,
      dbClickSensitivity,
      wrapperComponent,
      contentComponent,
      scale,
      positionX,
      positionY,
    } = this.state;
    if (!event) return console.error("Double click function require event prop");
    if (!zoomingEnabled || disabled) return;
    this.handleZoom(event, false, 1, dbClickSensitivity);
  };

  setScale = scale => {
    this.setState(state => reducer(state, { type: SET_SCALE, scale: scale }));
  };

  setPositionX = positionX => {
    this.setState(state =>
      reducer(state, { type: SET_POSITION_X, positionX: roundNumber(positionX, 3) })
    );
  };

  setPositionY = positionY => {
    this.setState(state =>
      reducer(state, { type: SET_POSITION_Y, positionY: roundNumber(positionY, 3) })
    );
  };

  setTransform = (positionX, positionY, scale) => {
    !isNaN(scale) && this.setScale(scale);
    !isNaN(positionX) && this.setPositionX(positionX);
    !isNaN(positionY) && this.setPositionY(positionY);
  };

  resetTransform = (animationTime = 0) => {
    const { defaultScale, defaultPositionX, defaultPositionY } = this.props.defaultValues;
    const { scale, positionX, positionY } = this.state;
    this.setState({ eventType: animationTime });
    if (scale === defaultScale && positionX === defaultPositionX && positionY === defaultPositionY)
      return;
    this.setScale(checkIsNumber(defaultScale, initialState.scale));
    this.setPositionX(checkIsNumber(defaultPositionX, initialState.positionX));
    this.setPositionY(checkIsNumber(defaultPositionY, initialState.positionY));
    this.setState(p => ({ eventType: p.eventType === animationTime ? false : p.eventType }));
  };

  //////////
  // Setters
  //////////

  setStartCoords = startCoords => {
    this.setState(state => reducer(state, { type: SET_START_COORDS, startCoords: startCoords }));
  };

  setIsDown = isDown => {
    this.setState(state => reducer(state, { type: SET_IS_DOWN, isDown: isDown }));
  };

  setDistance = distance => {
    this.setState(state => reducer(state, { type: SET_DISTANCE, distance: distance }));
  };

  setWrapperComponent = wrapperComponent => {
    this.setState(state =>
      reducer(state, { type: SET_WRAPPER, wrapperComponent: wrapperComponent })
    );
  };

  setContentComponent = contentComponent => {
    this.setState(state =>
      reducer(state, { type: SET_CONTENT, contentComponent: contentComponent })
    );
  };

  // PROPS

  getCallbackProps = () => {
    return {
      positionX: this.state.positionX,
      positionY: this.state.positionY,
      scale: this.state.scale,
      sensitivity: this.state.sensitivity,
      maxScale: this.state.maxScale,
      minScale: this.state.minScale,
      wheelAnimationSpeed: this.state.wheelAnimationSpeed,
      zoomAnimationSpeed: this.state.zoomAnimationSpeed,
      pinchAnimationSpeed: this.state.pinchAnimationSpeed,
      panAnimationSpeed: this.state.panAnimationSpeed,
      minPositionX: this.state.minPositionX,
      minPositionY: this.state.minPositionY,
      maxPositionX: this.state.maxPositionX,
      maxPositionY: this.state.maxPositionY,
      limitToBounds: this.state.limitToBounds,
      zoomingEnabled: this.state.zoomingEnabled,
      panningEnabled: this.state.panningEnabled,
      transformEnabled: this.state.transformEnabled,
      pinchEnabled: this.state.pinchEnabled,
      enableZoomedOutPanning: this.state.enableZoomedOutPanning,
      disabled: this.state.disabled,
      zoomOutSensitivity: this.state.zoomOutSensitivity,
      zoomInSensitivity: this.state.zoomInSensitivity,
      dbClickSensitivity: this.state.dbClickSensitivity,
      pinchSensitivity: this.state.pinchSensitivity,
      dbClickEnabled: this.state.dbClickEnabled,
      lastPositionZoomEnabled: this.state.lastPositionZoomEnabled,
      previousScale: this.state.previousScale,
    };
  };

  render() {
    /**
     * Context provider value
     */
    const value = {
      state: this.getCallbackProps(),
      dispatch: {
        setScale: this.setScale,
        setPositionX: this.setPositionX,
        setPositionY: this.setPositionY,
        zoomIn: this.zoomIn,
        zoomOut: this.zoomOut,
        setTransform: this.setTransform,
        resetTransform: this.resetTransform,
      },
      nodes: {
        setWrapperComponent: this.setWrapperComponent,
        setContentComponent: this.setContentComponent,
      },
      internal: {
        handleZoom: this.handleZoom,
        handleStartPanning: this.handleStartPanning,
        handlePanning: this.handlePanning,
        handleStopPanning: this.handleStopPanning,
        handleDbClick: this.handleDbClick,
        handlePinchStart: this.handlePinchStart,
        handlePinch: this.handlePinch,
        handlePinchStop: this.handlePinchStop,
        eventType: this.state.eventType,
      },
    };
    const { children } = this.props;
    const content =
      typeof children === "function" ? children({ ...value.state, ...value.dispatch }) : children;

    return <Context.Provider value={value}>{content}</Context.Provider>;
  }
}

StateProvider.defaultProps = {
  defaultValues: {},
  onWheelStart: null,
  onWheel: null,
  onWheelStop: null,
  onPanningStart: null,
  onPanning: null,
  onPanningStop: null,
  onPinchingStart: null,
  onPinching: null,
  onPinchingStop: null,
};

StateProvider.propTypes = {
  children: PropTypes.any,
  defaultValues: PropTypes.object,
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

export { Context, StateProvider };
