import React, { Component } from "react";
import PropTypes from "prop-types";
import { initialState } from "./InitialState";
import { roundNumber, getDistance, handleCallback } from "./utils";
import {
  handleZoomWheel,
  checkPositionBounds,
  handleZoomControls,
  handleZoomDbClick,
  resetTransformations,
} from "./_zoom";
import { handleZoomPinch } from "./_pinch";
import { handlePanning, getClientPosition } from "./_pan";
import makePassiveEventOption from "./makePassiveEventOption";

const Context = React.createContext({});

let timer = null;
const timerTime = 50;

class StateProvider extends Component {
  state = {
    ...initialState,
    ...this.props.defaultValues,
    ...this.props.dynamicValues,
    previousScale: initialState.scale,
    startAnimation: false,
  };

  pinchStartDistance = null;
  lastDistance = null;
  pinchStartScale = null;
  distance = null;
  bounds = null;
  startPanningCoords = null;
  velocityTime = null;
  lastMousePosition = null;
  velocity = null;
  animate = false;
  offsetX = null;
  offsetY = null;

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
    const { wrapperComponent, enableZoomedOutPanning, startAnimation } = this.state;
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

    if (this.bounds && oldState.enableZoomedOutPanning !== enableZoomedOutPanning)
      this.bounds = null;
    if (this.velocity && startAnimation && !this.animate) this.animateVelocity();
  }

  //////////
  // Wheel
  //////////

  handleWheel = event => {
    const { enableWheel, enableTouchPadPinch } = this.state;
    const { onWheelStart, onWheel, onWheelStop } = this.props;

    // ctrlKey detects if touchpad execute wheel or pinch gesture
    if (!enableWheel && !event.ctrlKey) return;
    if (!enableTouchPadPinch && event.ctrlKey) return;

    if (!timer) {
      // Wheel start event
      this.handleDisableVelocity();
      handleCallback(onWheelStart, this.getCallbackProps());
    }

    // Wheel event
    handleZoomWheel.bind(this, event)();
    handleCallback(onWheel, this.getCallbackProps());

    // Wheel stop event
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleCallback(onWheelStop, this.getCallbackProps());
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

  velocityTimeSpeed = (speed, animationTime) => {
    const { velocityBasedOnSpeed } = this.state;

    if (velocityBasedOnSpeed) {
      return animationTime - animationTime / Math.max(1.6, speed);
    }
    return animationTime;
  };

  handleEnableVelocity = () => {
    this.setState({ startAnimation: false });
  };

  handleDisableVelocity = () => {
    this.velocity = null;
    this.animate = false;
    this.setState({ startAnimation: false });
  };

  handleFireVelocity = () => {
    this.setState({ startAnimation: true });
  };

  easeOut = p => -Math.cos(p * Math.PI) / 2 + 0.5;

  animateVelocity = () => {
    this.animate = true;
    const {
      startAnimation,
      positionX,
      positionY,
      limitToBounds,
      scale,
      velocityAnimationSpeed,
      lockAxisX,
      lockAxisY,
    } = this.state;
    const startTime = new Date().getTime();

    if (!this.velocity || !this.bounds) return this.handleDisableVelocity();
    const { velocityX, velocityY, velocity } = this.velocity;
    const animationTime = this.velocityTimeSpeed(velocity, velocityAnimationSpeed);
    const targetX = velocityX * scale;
    const targetY = velocityY * scale;

    this.offsetX = positionX;
    this.offsetY = positionY;

    const animate = () => {
      if (!startAnimation || !this.animate) {
        return;
      }

      let frameTime = new Date().getTime() - startTime;
      const time = frameTime / animationTime;
      const step = this.easeOut(time);
      if (frameTime >= animationTime) {
        this.handleDisableVelocity();
      } else {
        const currentPositionX = lockAxisX ? positionX : this.offsetX + targetX - targetX * step;
        const currentPositionY = lockAxisY ? positionY : this.offsetY + targetY - targetY * step;

        const calculatedPosition = checkPositionBounds(
          currentPositionX,
          currentPositionY,
          this.bounds,
          limitToBounds
        );

        this.offsetX = calculatedPosition.x;
        this.offsetY = calculatedPosition.y;

        // Save panned position
        this.setState({ positionX: calculatedPosition.x, positionY: calculatedPosition.y });
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  calculateVelocityStart = event => {
    const { enableVelocity, minVelocityScale, scale, disabled } = this.state;
    if (!enableVelocity || minVelocityScale >= scale || disabled) return;
    this.handleEnableVelocity();
    const now = Date.now();
    if (this.lastMousePosition) {
      const position = getClientPosition(event);
      if (!position) return console.error("No mouse or touch position detected");
      const { clientX, clientY } = position;
      const distanceX = clientX - this.lastMousePosition.clientX;
      const distanceY = clientY - this.lastMousePosition.clientY;
      const interval = now - this.velocityTime;
      const velocityX = distanceX / interval;
      const velocityY = distanceY / interval;
      const velocity = Math.sqrt(distanceX * distanceX + distanceY * distanceY) / interval;

      this.velocity = { velocityX, velocityY, velocity };
    }
    const position = getClientPosition(event);
    this.lastMousePosition = position;
    this.velocityTime = now;
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
