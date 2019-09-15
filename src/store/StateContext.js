import React, { Component } from "react";
import PropTypes from "prop-types";
import { initialState } from "./InitialState";
import { roundNumber, getDistance, handleCallback } from "./utils";
import {
  handleZoom,
  handleZoomControls,
  handleZoomDbClick,
  resetTransformations,
  animatePadding,
} from "./_zoom";
import { handleZoomPinch } from "./_pinch";
import { handlePanning } from "./_pan";
import { handleFireVelocity, animateVelocity, calculateVelocityStart } from "./_velocity";
import { handleDisableAnimation } from "./_animations";
import makePassiveEventOption from "./makePassiveEventOption";

const Context = React.createContext({});

let timer = null;
const timerTime = 100;
let wheelTimer = null;
const wheelTime = 50;

class StateProvider extends Component {
  state = {
    wrapperComponent: null,
    contentComponent: null,
    startAnimation: false,
  };

  stateProvider = {
    ...initialState,
    ...this.props.dynamicValues,
    ...this.props.defaultValues,
    previousScale: this.props.defaultValues.scale || initialState.scale,
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
  throttleTime = 30;
  // zoom helpers
  zoomPaddingAnimation = null;
  zoomPaddingTimer = null;
  // wheel helpers
  wheelEnd = false;
  lastWheelScale = null;
  lastWheelDelta = null;

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
    const { wrapperComponent, contentComponent, startAnimation } = this.state;
    const { dynamicValues } = this.props;
    if (!oldState.contentComponent && contentComponent) {
      this.stateProvider = { ...this.stateProvider, contentComponent };
    }
    if (!oldState.wrapperComponent && wrapperComponent) {
      this.stateProvider = { ...this.stateProvider, wrapperComponent };

      // Zooming events on wrapper
      const passiveOption = makePassiveEventOption(false);
      wrapperComponent.addEventListener("mousewheel", this.handleWheel, passiveOption);
      wrapperComponent.addEventListener("dblclick", this.handleDbClick, passiveOption);
      wrapperComponent.addEventListener("touchstart", this.handleTouchStart, passiveOption);
      wrapperComponent.addEventListener("touchmove", this.handleTouch, passiveOption);
      wrapperComponent.addEventListener("touchend", this.handleTouchStop, passiveOption);
    }

    // start velocity animation
    if (this.velocity && startAnimation) animateVelocity.bind(this)();

    // when bounds limiters change
    if (
      oldProps.dynamicValues !== dynamicValues &&
      (oldProps.dynamicValues.limitToBounds !== dynamicValues.limitToBounds ||
        oldProps.dynamicValues.limitToWrapperBounds !== dynamicValues.limitToWrapperBounds)
    ) {
      this.bounds = null;
    }

    // must be at the end of the update function
    if (oldProps.dynamicValues !== dynamicValues) {
      this.stateProvider = { ...this.stateProvider, ...dynamicValues };
      this.forceUpdate();
    }
  }

  //////////
  // Wheel
  //////////

  handleWheel = event => {
    const { enableWheel, enableTouchPadPinch, scale, maxScale, minScale } = this.stateProvider;
    const { onWheelStart, onWheel, onWheelStop, onZoomChange } = this.props;

    if (scale != this.lastWheelScale) {
      this.wheelStart = false;
      this.lastWheelScale = scale;
      clearTimeout(timer);
      timer = setTimeout(() => {
        animatePadding.bind(this, event)();
        handleCallback(onWheelStop, this.getCallbackProps());
        handleCallback(onZoomChange, this.getCallbackProps());
        timer = null;
        this.lastWheelScale = null;
        this.wheelEnd = true;
      }, timerTime);
    }
    if (!this.lastWheelDelta) this.lastWheelDelta = event.deltaY;
    if (this.wheelEnd) {
      if (Math.abs(event.deltaY) <= Math.abs(this.lastWheelDelta)) {
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => {
          wheelTimer = null;
          this.wheelEnd = false;
          this.lastWheelDelta = null;
        }, wheelTime);
        this.lastWheelDelta = event.deltaY;
      }
      event.stopPropagation();
      event.preventDefault();
      return;
    }

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
    if (scale > maxScale || scale < minScale) {
      clearTimeout(this.zoomPaddingTimer);
      this.zoomPaddingTimer = setTimeout(() => {}, 10);
    }
  };

  //////////
  // Panning
  //////////

  checkIsPanningActive = event => {
    const { panningEnabled, disabled } = this.stateProvider;

    return (
      !this.isDown ||
      !panningEnabled ||
      disabled ||
      (event.touches &&
        (event.touches.length !== 1 || Math.abs(this.startCoords.x - event.touches[0].clientX) < 1))
    );
  };

  handleSetUpPanning = (x, y) => {
    const { positionX, positionY } = this.stateProvider;
    this.isDown = true;
    this.startCoords = { x: x - positionX, y: y - positionY };

    handleCallback(this.props.onPanningStart, this.getCallbackProps());
  };

  handleStartPanning = event => {
    const { panningEnabled, disabled, wrapperComponent } = this.stateProvider;
    const { target, touches } = event;
    if (!panningEnabled || disabled || (wrapperComponent && !wrapperComponent.contains(target)))
      return;

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
    const { scale } = this.stateProvider;
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

  handlePinchStop = event => {
    this.pinchStartDistance = null;
    this.lastDistance = null;
    this.pinchStartScale = null;
    console.log("poszlo");
    animatePadding.bind(this, event)();
    handleCallback(this.props.onPinchingStop, this.getCallbackProps());
  };

  //////////
  // Touch Events
  //////////

  handleTouchStart = event => {
    const { disabled } = this.stateProvider;
    const { touches } = event;
    handleDisableAnimation.bind(this)();
    if (disabled) return;
    if (touches && touches.length === 1) return this.handleStartPanning(event);
    if (touches && touches.length === 2) return this.handlePinchStart(event);
  };

  handleTouch = event => {
    const { panningEnabled, pinchEnabled, disabled } = this.stateProvider;
    if (disabled) return;
    if (panningEnabled && event.touches.length === 1) return this.handlePanning(event);
    if (pinchEnabled && event.touches.length === 2) return this.handlePinch(event);
  };

  handleTouchStop = event => {
    this.handlePinchStop(event);
    this.handleStopPanning();
  };

  //////////
  // Controls
  //////////

  resetLastMousePosition = () =>
    (this.stateProvider = { ...this.stateProvider, lastMouseEventPosition: null });

  zoomIn = event => {
    const { zoomingEnabled, disabled, zoomInStep } = this.stateProvider;
    if (!event) throw Error("Zoom in function require event prop");
    if (!zoomingEnabled || disabled) return;
    handleZoomControls.bind(this, event, 1, zoomInStep)();
  };

  zoomOut = event => {
    const { zoomingEnabled, disabled, zoomOutStep } = this.stateProvider;
    if (!event) throw Error("Zoom out function require event prop");
    if (!zoomingEnabled || disabled) return;
    handleZoomControls.bind(this, event, -1, zoomOutStep)();
  };

  handleDbClick = event => {
    const { zoomingEnabled, disabled, dbClickStep, dbClickEnabled } = this.stateProvider;
    if (!event) throw Error("Double click function require event prop");
    if (!zoomingEnabled || disabled || !dbClickEnabled) return;
    handleZoomDbClick.bind(this, event, 1, dbClickStep)();
  };

  setScale = scale => {
    this.stateProvider = { ...this.stateProvider, scale };
    // update component transformation
    this.setContentComponentTransformation();
  };

  setPositionX = positionX => {
    this.stateProvider = { ...this.stateProvider, positionX: roundNumber(positionX, 3) };
    // update component transformation
    this.setContentComponentTransformation();
  };

  setPositionY = positionY => {
    this.stateProvider = { ...this.stateProvider, positionY: roundNumber(positionY, 3) };
    // update component transformation
    this.setContentComponentTransformation();
  };

  setTransform = (positionX, positionY, scale) => {
    if (!this.stateProvider.transformEnabled) return;
    !isNaN(scale) && this.setScale(scale);
    !isNaN(positionX) && this.setPositionX(positionX);
    !isNaN(positionY) && this.setPositionY(positionY);
  };

  resetTransform = () => {
    const { disabled } = this.stateProvider;
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
    this.setState({ contentComponent }, () => {
      if (this.stateProvider.isCentered) {
        const { scale } = this.stateProvider;
        const rect = this.state.wrapperComponent.getBoundingClientRect();
        this.stateProvider.positionX = (rect.width - rect.width * scale) / 2;
        this.stateProvider.positionY = (rect.height - rect.height * scale) / 2;
      }
      this.setContentComponentTransformation();
    });
  };

  setContentComponentTransformation = () => {
    const { contentComponent } = this.state;
    if (!contentComponent) return console.error("There is no content component");
    const transform = `translate(${this.stateProvider.positionX}px, ${this.stateProvider.positionY}px) scale(${this.stateProvider.scale})`;
    contentComponent.style.transform = transform;
    this.setState({ updated: true });
  };

  //////////
  // Props
  //////////
  getCallbackProps = () => {
    return {
      positionX: this.stateProvider.positionX,
      positionY: this.stateProvider.positionY,
      scale: this.stateProvider.scale,
      sensitivity: this.stateProvider.sensitivity,
      maxScale: this.stateProvider.maxScale,
      minScale: this.stateProvider.minScale,
      wheelAnimationSpeed: this.stateProvider.wheelAnimationSpeed,
      zoomAnimationSpeed: this.stateProvider.zoomAnimationSpeed,
      pinchAnimationSpeed: this.stateProvider.pinchAnimationSpeed,
      panAnimationSpeed: this.stateProvider.panAnimationSpeed,
      minPositionX: this.stateProvider.minPositionX,
      minPositionY: this.stateProvider.minPositionY,
      maxPositionX: this.stateProvider.maxPositionX,
      maxPositionY: this.stateProvider.maxPositionY,
      limitToBounds: this.stateProvider.limitToBounds,
      zoomingEnabled: this.stateProvider.zoomingEnabled,
      panningEnabled: this.stateProvider.panningEnabled,
      transformEnabled: this.stateProvider.transformEnabled,
      pinchEnabled: this.stateProvider.pinchEnabled,
      limitToWrapperBounds: this.stateProvider.limitToWrapperBounds,
      disabled: this.stateProvider.disabled,
      zoomOutStep: this.stateProvider.zoomOutStep,
      zoomInStep: this.stateProvider.zoomInStep,
      dbClickStep: this.stateProvider.dbClickStep,
      pinchSensitivity: this.stateProvider.pinchSensitivity,
      dbClickEnabled: this.stateProvider.dbClickEnabled,
      lastPositionZoomEnabled: this.stateProvider.lastPositionZoomEnabled,
      previousScale: this.stateProvider.previousScale,
      scalePadding: this.stateProvider.scalePadding,
      lockAxisX: this.stateProvider.lockAxisX,
      lockAxisY: this.stateProvider.lockAxisY,
      velocityTimeBasedOnMove: this.stateProvider.velocityTimeBasedOnMove,
      velocitySensitivity: this.stateProvider.velocitySensitivity,
      scalePaddingAnimationSpeed: this.stateProvider.scalePaddingAnimationSpeed,
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
  onZoomChange: PropTypes.func,
};

export { Context, StateProvider };
