import React, { Component } from "react";
import PropTypes from "prop-types";
import { initialState } from "./InitialState";
import {
  roundNumber,
  checkIsNumber,
  relativeCoords,
  getDistance,
  getLastPositionZoomCoords,
  handleCallback,
} from "./utils";
import { handleZoomWheel } from "./_zoom";
import { handleZoomPinch } from "./_pinch";
import { handlePanning, getClientPosition } from "./_pan";
import makePassiveEventOption from "./makePassiveEventOption";

const Context = React.createContext({});

let timer = null;
const timerTime = 50;

let distance = null;

class StateProvider extends Component {
  state = {
    ...initialState,
    ...this.props.defaultValues,
    previousScale: initialState.scale,
  };

  pinchStartDistance = null;
  lastDistance = null;
  pinchStartScale = null;
  distance = null;
  bounds = null;
  startPanningCoords = null;
  enableVelocityCalculation = false;
  startVelocity = false;
  velocityStartPosition = null;
  lastMouseX = null;
  lastMouseY = null;
  velocity = null;

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
    const { wrapperComponent, enableZoomedOutPanning } = this.state;
    const { defaultValues } = this.props;
    if (!oldState.wrapperComponent && this.state.wrapperComponent) {
      // Zooming events on wrapper
      const passiveOption = makePassiveEventOption(false);
      wrapperComponent.addEventListener("wheel", this.handleWheel, passiveOption);
      wrapperComponent.addEventListener("dblclick", this.handleDbClick, passiveOption);
      wrapperComponent.addEventListener("touchstart", this.handleTouchStart, passiveOption);
      wrapperComponent.addEventListener("touchmove", this.handleTouch, passiveOption);
      wrapperComponent.addEventListener("touchend", this.handleTouchStop, passiveOption);
    }
    if (oldProps.defaultValues !== defaultValues) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ ...defaultValues });
    }
    if (this.bounds && oldState.enableZoomedOutPanning !== enableZoomedOutPanning) {
      this.bounds = null;
    }
  }

  //////////
  // Wheel
  //////////

  handleWheel = event => {
    // Wheel start event
    if (!timer) {
      this.handleDisableVelocity();
      this.setState({ eventType: "wheel" });
      handleCallback(this.props.onWheelStart, this.getCallbackProps());
    }

    // Wheel event
    handleZoomWheel.bind(this, event)();
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

  checkIsPanningActive = event => {
    const { panningEnabled, disabled } = this.state;
    return (
      !this.isDown ||
      !panningEnabled ||
      disabled ||
      (event.touches &&
        (event.touches.length !== 1 || Math.abs(this.startCoords.x - event.touches[0].clientX) < 1))
    );
  };

  handleSetUpPanning = (x, y) => {
    const { positionX, positionY } = this.state;
    this.isDown = true;
    this.startCoords = { x: x - positionX, y: y - positionY };
    handleCallback(this.props.onPanningStart, this.getCallbackProps());
  };

  handleStartPanning = event => {
    const { panningEnabled, disabled, wrapperComponent } = this.state;
    const { target, touches } = event;
    if (!panningEnabled || disabled || !wrapperComponent.contains(target)) return;

    this.handleDisableVelocity();

    // Mobile points
    if (touches && touches.length === 1) {
      this.handleSetUpPanning(touches[0].clientX, touches[0].clientY);
    }
    // Desktop points
    if (!touches) {
      this.handleSetUpPanning(event.clientX, event.clientY);
    }
  };

  handlePanning = event => {
    event.preventDefault();
    if (this.checkIsPanningActive(event)) return;
    event.stopPropagation();

    this.calculateVelocityStart(event);
    handlePanning.bind(this, event)();
    handleCallback(this.props.onPanning, this.getCallbackProps());
  };

  handleStopPanning = () => {
    if (this.isDown) {
      this.isDown = false;
      distance = null;
      this.handleFireVelocity();
      handleCallback(this.props.onPanningStop, this.getCallbackProps());
    }
  };

  //////////
  // Pinch
  //////////

  handlePinchStart = event => {
    const { scale } = this.state;
    event.preventDefault();
    event.stopPropagation();

    this.handleDisableVelocity();
    const distance = getDistance(event.touches[0], event.touches[1]);
    this.pinchStartDistance = distance;
    this.lastDistance = distance;
    this.pinchStartScale = scale;

    handleCallback(this.props.onPinchingStart, this.getCallbackProps());
  };

  handlePinch = event => {
    handleZoomPinch.bind(this, event)();
    handleCallback(this.props.onPinching, this.getCallbackProps());
  };

  handlePinchStop = () => {
    if (typeof pinchStartScale === "number") {
      this.pinchStartDistance = null;
      this.lastDistance = null;
      this.pinchStartScale = null;
      handleCallback(this.props.onPinchingStop, this.getCallbackProps());
    }
  };

  //////////
  // Touch Events
  //////////

  handleTouchStart = event => {
    const { disabled } = this.state;
    const { touches } = event;
    this.handleDisableVelocity();
    if (disabled) return;
    if (touches && touches.length === 1) return this.handleStartPanning(event);
    if (touches && touches.length === 2) return this.handlePinchStart(event);
  };

  handleTouch = event => {
    const { panningEnabled, pinchEnabled, disabled } = this.state;
    if (disabled) return;
    if (panningEnabled && event.touches.length === 1) return this.handlePanning(event);
    if (pinchEnabled && event.touches.length === 2) return this.handlePinch(event);
  };

  handleTouchStop = () => {
    this.handlePinchStop();
    this.handleStopPanning();
  };

  //////////
  // Velocity
  //////////

  handleEnableVelocity = () => {
    this.enableVelocityCalculation = true;
    this.startVelocity = false;
  };

  handleDisableVelocity = () => {
    this.enableVelocityCalculation = false;
    this.startVelocity = false;
    this.velocity = null;
  };

  handleFireVelocity = () => {
    this.enableVelocityCalculation = false;
    this.startVelocity = true;
  };

  calculateVelocityStart = event => {
    this.handleEnableVelocity();
    if (!this.enableVelocityCalculation) return;
    if (this.velocityStartDate === null) {
      const position = getClientPosition(event);
      if (!position) return;
      const { clientX, clientY } = position;
      this.velocityStartDate = Date.now();
      this.lastMouseX = clientX;
      this.lastMouseY = clientY;
      return;
    }

    const position = getClientPosition(event);
    if (!position) return console.error("No mouse or touch position detected");
    const { clientX, clientY } = position;
    const newPositionX = clientX;
    const newPositionY = clientY;
    const now = Date.now();
    const distanceX = newPositionX - this.lastMouseX;
    const distanceY = newPositionY - this.lastMouseY;
    const interval = now - this.velocityStartDate;
    const velocity = Math.sqrt(distanceX * distanceX + distanceY * distanceY) / interval;

    this.velocity = { velocity: velocity || 0, distanceX, distanceY };

    this.velocityStartDate = now;
    this.lastMouseX = newPositionX;
    this.lastMouseY = newPositionY;
  };

  //////////
  // Controls
  //////////

  resetLastMousePosition = () => this.setState({ lastMouseEventPosition: null });

  zoomIn = event => {
    const {
      zoomingEnabled,
      disabled,
      zoomInStep,
      scale,
      lastMouseEventPosition,
      previousScale,
      lastPositionZoomEnabled,
      wrapperComponent,
      contentComponent,
      positionX,
      positionY,
    } = this.state;
    if (!event) return console.error("Zoom in function require event prop");
    if (!zoomingEnabled || disabled) return;
    const zoomCoords = getLastPositionZoomCoords({
      resetLastMousePosition: this.resetLastMousePosition,
      lastPositionZoomEnabled,
      lastMouseEventPosition,
      previousScale,
      scale,
      wrapperComponent,
      contentComponent,
      positionX,
      positionY,
    });
    this.handleZoom(event, zoomCoords, 1, zoomInStep);
  };

  zoomOut = event => {
    const {
      zoomingEnabled,
      disabled,
      zoomOutStep,
      scale,
      lastMouseEventPosition,
      previousScale,
      lastPositionZoomEnabled,
      wrapperComponent,
      contentComponent,
      positionX,
      positionY,
    } = this.state;
    if (!event) return console.error("Zoom out function require event prop");
    if (!zoomingEnabled || disabled) return;
    const zoomCoords = getLastPositionZoomCoords({
      resetLastMousePosition: this.resetLastMousePosition,
      lastPositionZoomEnabled,
      lastMouseEventPosition,
      previousScale,
      scale,
      wrapperComponent,
      contentComponent,
      positionX,
      positionY,
    });
    this.handleZoom(event, zoomCoords, -1, zoomOutStep);
  };

  handleDbClick = event => {
    const { zoomingEnabled, disabled, dbClickStep, dbClickEnabled } = this.state;
    if (!event) return console.error("Double click function require event prop");
    if (!zoomingEnabled || disabled || !dbClickEnabled) return;
    this.handleZoom(event, false, 1, dbClickStep);
  };

  setScale = scale => {
    this.setState({ scale });
  };

  setPositionX = positionX => {
    this.setState({ positionX: roundNumber(positionX, 3) });
  };

  setPositionY = positionY => {
    this.setState({ positionY: roundNumber(positionY, 3) });
  };

  setTransform = (positionX, positionY, scale) => {
    if (!this.state.transformEnabled) return;
    !isNaN(scale) && this.setScale(scale);
    !isNaN(positionX) && this.setPositionX(positionX);
    !isNaN(positionY) && this.setPositionY(positionY);
  };

  resetTransform = animation => {
    const { defaultScale, defaultPositionX, defaultPositionY } = this.props.defaultValues;
    const { scale, positionX, positionY, disabled } = this.state;
    if (disabled) return;
    if (scale === defaultScale && positionX === defaultPositionX && positionY === defaultPositionY)
      return;
    this.setScale(checkIsNumber(defaultScale, initialState.scale));
    this.setPositionX(checkIsNumber(defaultPositionX, initialState.positionX));
    this.setPositionY(checkIsNumber(defaultPositionY, initialState.positionY));
  };

  //////////
  // Setters
  //////////

  setZoomTransform = (scale, positionX, positionY, previousScale, lastMouseEventPosition) => {
    this.setState({ scale, positionX, positionY, previousScale, lastMouseEventPosition });
  };

  setIsDown = isDown => {
    this.setState({ isDown });
  };

  setWrapperComponent = wrapperComponent => {
    this.setState({ wrapperComponent });
  };

  setContentComponent = contentComponent => {
    this.setState({ contentComponent });
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
      zoomOutStep: this.state.zoomOutStep,
      zoomInStep: this.state.zoomInStep,
      dbClickStep: this.state.dbClickStep,
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
        handleTouchStart: this.handleTouchStart,
        handleTouch: this.handleTouch,
        handleTouchStop: this.handleTouchStop,
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
