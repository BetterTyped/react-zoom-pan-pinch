import React, { Component } from "react";
import PropTypes from "prop-types";
import { initialState } from "./InitialState";
import { roundNumber, getDistance, handleCallback } from "./utils";
import { handleZoom, handleZoomControls, handleZoomDbClick, resetTransformations } from "./_zoom";
import { handleZoomPinch } from "./_pinch";
import { handlePanning } from "./_pan";
import { handleFireVelocity, animateVelocity, calculateVelocityStart } from "./_velocity";
import { handleDisableAnimation } from "./_animations";
import makePassiveEventOption from "./makePassiveEventOption";

const Context = React.createContext({});

let timer = null;
const timerTime = 50;

class StateProvider extends Component {
  state = {
    ...initialState,
    ...this.props.dynamicValues,
    ...this.props.defaultValues,
    previousScale: initialState.scale,
    startAnimation: false,
    startZoomAnimation: false,
  };

  // pinch helpers
  pinchStartDistance = null;
  lastDistance = null;
  pinchStartScale = null;
  distance = null;
  bounds = null;
  startPanningCoords = null;
  // velocity helpers
  velocityTime = null;
  lastMousePosition = null;
  velocity = null;
  animate = false;
  offsetX = null;
  offsetY = null;
  throttle = false;
  throttleTime = 50;

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
    const { wrapperComponent, limitToWrapperBounds, startAnimation } = this.state;
    const { dynamicValues } = this.props;
    if (!oldState.wrapperComponent && this.state.wrapperComponent) {
      // Zooming events on wrapper
      const passiveOption = makePassiveEventOption(false);
      wrapperComponent.addEventListener("mousewheel", this.handleWheel, passiveOption);
      wrapperComponent.addEventListener("dblclick", this.handleDbClick, passiveOption);
      wrapperComponent.addEventListener("touchstart", this.handleTouchStart, passiveOption);
      wrapperComponent.addEventListener("touchmove", this.handleTouch, passiveOption);
      wrapperComponent.addEventListener("touchend", this.handleTouchStop, passiveOption);
    }
    // eslint-disable-next-line react/no-did-update-set-state
    if (oldProps.dynamicValues !== dynamicValues) this.setState({ ...dynamicValues });

    if (this.bounds && oldState.limitToWrapperBounds !== limitToWrapperBounds) this.bounds = null;
    if (this.velocity && startAnimation && !this.animate) animateVelocity.bind(this)();
  }

  //////////
  // Wheel
  //////////

  handleWheel = event => {
    const { enableWheel, enableTouchPadPinch } = this.state;
    const { onWheelStart, onWheel, onWheelStop, onZoomChange } = this.props;

    // ctrlKey detects if touchpad execute wheel or pinch gesture
    if (!enableWheel && !event.ctrlKey) return;
    if (!enableTouchPadPinch && event.ctrlKey) return;

    if (!timer) {
      // Wheel start event
      handleDisableAnimation.bind(this)();
      handleCallback(onWheelStart, this.getCallbackProps());
    }

    // Wheel event
    handleZoom.bind(this, event, undefined, undefined, undefined, "wheel")();
    handleCallback(onWheel, this.getCallbackProps());

    // Wheel stop event
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleCallback(onWheelStop, this.getCallbackProps());
      handleCallback(onZoomChange, this.getCallbackProps());
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

    handleDisableAnimation.bind(this)();
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

    calculateVelocityStart.bind(this, event)();
    handlePanning.bind(this, event)();
    handleCallback(this.props.onPanning, this.getCallbackProps());
  };

  handleStopPanning = () => {
    if (this.isDown) {
      this.isDown = false;
      handleFireVelocity.bind(this)();
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

    handleDisableAnimation.bind(this)();
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
    handleDisableAnimation.bind(this)();
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
  // Controls
  //////////

  resetLastMousePosition = () => this.setState({ lastMouseEventPosition: null });

  zoomIn = event => {
    const { zoomingEnabled, disabled, zoomInStep } = this.state;
    if (!event) throw Error("Zoom in function require event prop");
    if (!zoomingEnabled || disabled) return;
    handleZoomControls.bind(this, event, 1, zoomInStep)();
  };

  zoomOut = event => {
    const { zoomingEnabled, disabled, zoomOutStep } = this.state;
    if (!event) throw Error("Zoom out function require event prop");
    if (!zoomingEnabled || disabled) return;
    handleZoomControls.bind(this, event, -1, zoomOutStep)();
  };

  handleDbClick = event => {
    const { zoomingEnabled, disabled, dbClickStep, dbClickEnabled } = this.state;
    if (!event) throw Error("Double click function require event prop");
    if (!zoomingEnabled || disabled || !dbClickEnabled) return;
    handleZoomDbClick.bind(this, event, 1, dbClickStep)();
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

  resetTransform = () => {
    const { disabled } = this.state;
    if (disabled) return;
    resetTransformations.bind(this)();
  };

  //////////
  // Setters
  //////////

  setWrapperComponent = wrapperComponent => {
    this.setState({ wrapperComponent });
  };

  setContentComponent = contentComponent => {
    this.setState({ contentComponent });
  };

  //////////
  // Props
  //////////
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
      limitToWrapperBounds: this.state.limitToWrapperBounds,
      disabled: this.state.disabled,
      zoomOutStep: this.state.zoomOutStep,
      zoomInStep: this.state.zoomInStep,
      dbClickStep: this.state.dbClickStep,
      pinchSensitivity: this.state.pinchSensitivity,
      dbClickEnabled: this.state.dbClickEnabled,
      lastPositionZoomEnabled: this.state.lastPositionZoomEnabled,
      previousScale: this.state.previousScale,
      lockAxisX: this.state.lockAxisX,
      lockAxisY: this.state.lockAxisY,
      velocityTimeBasedOnMove: this.state.velocityTimeBasedOnMove,
      velocitySensitivity: this.state.velocitySensitivity,
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
  dynamicValues: {},
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
  dynamicValues: PropTypes.object,
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
