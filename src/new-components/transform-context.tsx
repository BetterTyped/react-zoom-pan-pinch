import React, { Component } from "react";
import { cancelTimeout } from "../new-utils/helpers.utils";
// import { initialState } from "./InitialState";
// import {
//   mergeProps,
//   getDistance,
//   handleCallback,
//   handleWheelStop,
//   getWindowScaleX,
//   getWindowScaleY,
// } from "./utils";
// import {
//   handleZoomControls,
//   handleDoubleClick,
//   resetTransformations,
//   handlePaddingAnimation,
//   handleWheelZoom,
//   handleCalculateBounds,
// } from "./zoom";
// import { handleCancelAnimation, animateComponent } from "./animations";
// import { handleZoomPinch } from "./pinch";
// import { handlePanning, handlePanningAnimation } from "./pan";
// import {
//   handleFireVelocity,
//   animateVelocity,
//   calculateVelocityStart,
// } from "./velocity";
// import makePassiveEventOption from "./makePassiveEventOption";
// import {
//   StateContextState,
//   StateContextProps,
// } from "./interfaces/stateContextInterface";
// import { getValidPropsFromObject } from "./propsHandlers";

type StartCoordsType = { x: number; y: number } | null;

const Context = React.createContext({});

const wheelStopEventTime = 180;
const wheelAnimationTime = 100;

class StateProvider extends Component<any, any> {
  public mounted = true;

  public transformState = {
    ...initialState,
    ...mergeProps(initialState, this.props.dynamicProps),
    ...this.props.defaultValues,
    previousScale:
      this.props.dynamicProps.scale ||
      this.props.defaultValues.scale ||
      initialState.scale,
  };

  // Components
  public wrapperComponent: HTMLDivElement | null = null;
  public contentComponent: HTMLDivElement | null = null;
  // Initialization
  public isInitialized = false;
  // Scale helpers
  public windowToWrapperScaleX = 0;
  public windowToWrapperScaleY = 0;
  // panning helpers
  public startCoords: StartCoordsType = null;
  public isMouseDown = false;
  // pinch helpers
  public pinchStartDistance = null;
  public lastDistance = null;
  public pinchStartScale = null;
  public distance = null;
  public bounds = null;
  // velocity helpers
  public velocityTime = null;
  public lastMousePosition = null;
  public velocity = null;
  public offsetX = null;
  public offsetY = null;
  public throttle = false;
  // wheel helpers
  public previousWheelEvent: WheelEvent | null = null;
  public lastScale = null;
  // animations helpers
  public animate = null;
  public animation = null;
  public maxBounds = null;
  // wheel event timers
  public wheelStopEventTimer: ReturnType<typeof setTimeout> | null = null;
  public wheelAnimationTimer: ReturnType<typeof setTimeout> | null = null;

  componentDidMount() {
    const passive = makePassiveEventOption(false);

    // Panning on window to allow panning when mouse is out of component wrapper
    window.addEventListener("mousedown", this.onPanningStart, passive);
    window.addEventListener("mousemove", this.onPanning, passive);
    window.addEventListener("mouseup", this.onPanningStop, passive);
  }

  componentWillUnmount() {
    const passive = makePassiveEventOption(false);

    window.removeEventListener("mousedown", this.onPanningStart, passive);
    window.removeEventListener("mousemove", this.onPanning, passive);
    window.removeEventListener("mouseup", this.onPanningStop, passive);

    handleCancelAnimation.call(this);
  }

  componentDidUpdate(oldProps) {
    const { wrapperComponent, contentComponent } = this.state;
    const { dynamicProps } = this.props;

    const hasComponents = Boolean(wrapperComponent && contentComponent);

    const { scale, options } = this.transformState;
    const { limitToWrapper } = options;

    const isChanged = oldProps.dynamicProps !== dynamicProps;
    const isUpdatedProp = Boolean(oldProps.dynamicProps);

    // set bound for animations
    if (hasComponents || isChanged) {
      this.maxBounds = handleCalculateBounds.call(this, scale, limitToWrapper);
    }

    // must be at the end of the update function, updates
    if (isUpdatedProp && isChanged) {
      this.animation = null;
      // TODO INITAILIZATION OF STATES
      this.transformState = {
        ...this.transformState,
        ...mergeProps(this.transformState, dynamicProps),
      };
      this.handleStylesUpdate();
    }
  }

  handleInitializeWrapperEvents = (wrapper: HTMLDivElement) => {
    // Zooming events on wrapper
    const passive = makePassiveEventOption(false);

    this.windowToWrapperScaleX = getWindowScaleX(wrapper);
    this.windowToWrapperScaleY = getWindowScaleY(wrapper);

    wrapper.addEventListener("wheel", this.onZoom, passive);
    wrapper.addEventListener("dblclick", this.onDbClick, passive);
    wrapper.addEventListener("touchstart", this.onTouchPanningStart, passive);
    wrapper.addEventListener("touchmove", this.onTouchPanning, passive);
    wrapper.addEventListener("touchend", this.onTouchPanningStop, passive);
  };

  handleInitializeContentEvents = (content: HTMLDivElement) => {
    const { positionX, positionY } = this.props.defaultValues;
    const { options, scale } = this.transformState;
    const { centerContent, limitToBounds, limitToWrapper } = options;

    const shouldFitComponent = limitToBounds && !limitToWrapper;
    const shouldCenterComponent = centerContent && !positionX && !positionY;

    if (shouldFitComponent || shouldCenterComponent) {
      // TODO CHECK THIS LOGIC
      const x = 25;
      const y = 25;
      const s = scale;

      const { transform, webkitTransform } = this.getTransform(x, y, s, "%");

      content.style.transform = transform;
      content.style.webkitTransform = webkitTransform;

      const bounds = handleCalculateBounds.call(this, scale, false);
      this.transformState.positionX = bounds.minPositionX;
      this.transformState.positionY = bounds.minPositionY;
    }

    this.handleStylesUpdate();
    this.forceUpdate();
  };

  //////////
  // Wheel
  //////////

  onZoom = (event: WheelEvent): void => {
    const { scale, wheel, options } = this.transformState;
    const { disabled, wheelEnabled, touchPadEnabled } = wheel;

    const { onWheelStart, onWheel, onWheelStop } = this.props;

    const isDisabled = disabled || options.disabled;
    const isAllowed = !this.isInitialized || this.isMouseDown || !isDisabled;

    // Check if it's possible to perform wheel event
    if (!isAllowed) return;
    // Event ctrlKey detects if touchpad action is executing wheel or pinch gesture
    if (!wheelEnabled && !event.ctrlKey) return;
    if (!touchPadEnabled && event.ctrlKey) return;

    // Wheel start event
    if (!this.wheelStopEventTimer) {
      this.lastScale = scale;
      handleCancelAnimation.call(this);
      handleCallback(onWheelStart, this.getCurrentState());
    }

    // Wheel event
    handleWheelZoom.call(this, event);
    handleCallback(onWheel, this.getCurrentState());
    this.handleStylesUpdate();
    this.previousWheelEvent = event;
    this.lastScale = this.transformState.scale;

    // fire animation
    cancelTimeout(this.wheelAnimationTimer);
    this.wheelAnimationTimer = setTimeout(() => {
      // TODO GO TO call FN
      if (!this.mounted) return;
      handlePaddingAnimation.call(this, event);
      this.wheelAnimationTimer = null;
    }, wheelAnimationTime);

    // Wheel stop event
    const hasStoppedZooming = handleWheelStop(
      this.previousWheelEvent,
      event,
      this.transformState,
    );
    if (hasStoppedZooming) {
      cancelTimeout(this.wheelStopEventTimer);
      this.wheelStopEventTimer = setTimeout(() => {
        // TODO GO TO call FN
        if (!this.mounted) return;
        handleCallback(onWheelStop, this.getCurrentState());
        this.wheelStopEventTimer = null;
      }, wheelStopEventTime);
    }
  };

  //////////
  // Panning
  //////////

  handleSetUpPanning = (x, y) => {
    const { positionX, positionY } = this.transformState;
    this.isMouseDown = true;
    this.startCoords = { x: x - positionX, y: y - positionY };

    handleCallback(this.props.onPanningStart, this.getCurrentState());
  };

  handleStartPanning = (event) => {
    const {
      wrapperComponent,
      scale,
      options: { minScale, maxScale, limitToWrapper },
      pan: { disabled },
    } = this.stateProvider;
    const { target, touches } = event;

    if (
      disabled ||
      this.stateProvider.options.disabled ||
      (wrapperComponent && !wrapperComponent.contains(target)) ||
      this.checkPanningTarget(event) ||
      scale < minScale ||
      scale > maxScale
    )
      return;

    handleCancelAnimation.call(this);
    this.bounds = handleCalculateBounds.call(this, scale, limitToWrapper);

    // Mobile points
    if (touches && touches.length === 1) {
      this.handleSetUpPanning(touches[0].clientX, touches[0].clientY);
    }
    // Desktop points
    if (!touches) {
      this.handleSetUpPanning(event.clientX, event.clientY);
    }
  };

  handlePanning = (event) => {
    if (this.isMouseDown) event.preventDefault();
    if (this.checkIsPanningActive(event)) return;
    event.stopPropagation();
    calculateVelocityStart.call(this, event);
    handlePanning.call(this, event);
    handleCallback(this.props.onPanning, this.getCurrentState());
  };

  handleStopPanning = () => {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      this.animate = false;
      this.animation = false;
      handleFireVelocity.call(this);
      handleCallback(this.props.onPanningStop, this.getCurrentState());

      const {
        pan: { velocity },
        scale,
      } = this.stateProvider;

      // start velocity animation
      if (this.velocity && velocity && scale > 1) {
        animateVelocity.call(this);
      } else {
        // fire fit to bounds animation
        handlePanningAnimation.call(this);
      }
    }
  };

  //   //////////
  //   // Pinch
  //   //////////

  //   handlePinchStart = event => {
  //     const { scale } = this.stateProvider;
  //     event.preventDefault();
  //     event.stopPropagation();

  //     handleCancelAnimation.call(this);
  //     const distance = getDistance(event.touches[0], event.touches[1]);
  //     this.pinchStartDistance = distance;
  //     this.lastDistance = distance;
  //     this.pinchStartScale = scale;
  //     this.isMouseDown = false;

  //     handleCallback(this.props.onPinchingStart, this.getCurrentState());
  //   };

  //   handlePinch = event => {
  //     this.isMouseDown = false;
  //     handleZoomPinch.call(this, event);
  //     handleCallback(this.props.onPinching, this.getCurrentState());
  //   };

  //   handlePinchStop = () => {
  //     if (typeof this.pinchStartScale === "number") {
  //       this.isMouseDown = false;
  //       this.velocity = null;
  //       this.lastDistance = null;
  //       this.pinchStartScale = null;
  //       this.pinchStartDistance = null;
  //       handlePaddingAnimation.call(this);
  //       handleCallback(this.props.onPinchingStop, this.getCurrentState());
  //     }
  //   };

  //   //////////
  //   // Touch Events
  //   //////////

  //   handleTouchStart = event => {
  //     const {
  //       wrapperComponent,
  //       contentComponent,
  //       scale,
  //       options: { disabled, minScale },
  //     } = this.stateProvider;
  //     const { touches } = event;
  //     if (disabled || !wrapperComponent || !contentComponent || scale < minScale)
  //       return;
  //     handleCancelAnimation.call(this);

  //     if (touches && touches.length === 1) return this.handleStartPanning(event);
  //     if (touches && touches.length === 2) return this.handlePinchStart(event);
  //   };

  //   handleTouch = event => {
  //     const { pan, pinch, options } = this.stateProvider;
  //     if (options.disabled) return;
  //     if (!pan.disabled && event.touches.length === 1)
  //       return this.handlePanning(event);
  //     if (!pinch.disabled && event.touches.length === 2)
  //       return this.handlePinch(event);
  //   };

  //   handleTouchStop = () => {
  //     this.handleStopPanning();
  //     this.handlePinchStop();
  //   };

  //   //////////
  //   // Controls
  //   //////////

  //   zoomIn = event => {
  //     const {
  //       zoomIn: { disabled, step },
  //       options,
  //     } = this.stateProvider;
  //     const { wrapperComponent, contentComponent } = this.state;

  //     if (!event) throw Error("Zoom in function requires event prop");
  //     if (disabled || options.disabled || !wrapperComponent || !contentComponent)
  //       return;
  //     handleZoomControls.call(this, 1, step);
  //   };

  //   zoomOut = event => {
  //     const {
  //       zoomOut: { disabled, step },
  //       options,
  //     } = this.stateProvider;
  //     const { wrapperComponent, contentComponent } = this.state;

  //     if (!event) throw Error("Zoom out function requires event prop");
  //     if (disabled || options.disabled || !wrapperComponent || !contentComponent)
  //       return;
  //     handleZoomControls.call(this, -1, step);
  //   };

  //   handleDbClick = event => {
  //     const {
  //       options,
  //       doubleClick: { disabled, step },
  //     } = this.stateProvider;
  //     const { wrapperComponent, contentComponent } = this.state;

  //     if (!event) throw Error("Double click function requires event prop");
  //     if (disabled || options.disabled || !wrapperComponent || !contentComponent)
  //       return;
  //     handleDoubleClick.call(this, event, 1, step);
  //   };

  //   setScale = (newScale, speed = 200, type = "easeOut") => {
  //     const {
  //       positionX,
  //       positionY,
  //       scale,
  //       options: { disabled },
  //     } = this.stateProvider;
  //     const { wrapperComponent, contentComponent } = this.state;
  //     if (disabled || !wrapperComponent || !contentComponent) return;
  //     const targetState = {
  //       positionX,
  //       positionY,
  //       scale: isNaN(newScale) ? scale : newScale,
  //     };

  //     animateComponent.call(this, {
  //       targetState,
  //       speed,
  //       type,
  //     });
  //   };

  //   setPositionX = (newPosX, speed = 200, type = "easeOut") => {
  //     const {
  //       positionX,
  //       positionY,
  //       scale,
  //       options: { disabled, transformEnabled },
  //     } = this.stateProvider;
  //     const { wrapperComponent, contentComponent } = this.state;
  //     if (disabled || !transformEnabled || !wrapperComponent || !contentComponent)
  //       return;
  //     const targetState = {
  //       positionX: isNaN(newPosX) ? positionX : newPosX,
  //       positionY,
  //       scale,
  //     };

  //     animateComponent.call(this, {
  //       targetState,
  //       speed,
  //       type,
  //     });
  //   };

  //   setPositionY = (newPosY, speed = 200, type = "easeOut") => {
  //     const {
  //       positionX,
  //       scale,
  //       positionY,
  //       options: { disabled, transformEnabled },
  //     } = this.stateProvider;
  //     const { wrapperComponent, contentComponent } = this.state;
  //     if (disabled || !transformEnabled || !wrapperComponent || !contentComponent)
  //       return;

  //     const targetState = {
  //       positionX,
  //       positionY: isNaN(newPosY) ? positionY : newPosY,
  //       scale,
  //     };

  //     animateComponent.call(this, {
  //       targetState,
  //       speed,
  //       type,
  //     });
  //   };

  //   setTransform = (
  //     newPosX,
  //     newPosY,
  //     newScale,
  //     speed = 200,
  //     type = "easeOut",
  //   ) => {
  //     const {
  //       positionX,
  //       positionY,
  //       scale,
  //       options: { disabled, transformEnabled },
  //     } = this.stateProvider;
  //     const { wrapperComponent, contentComponent } = this.state;
  //     if (disabled || !transformEnabled || !wrapperComponent || !contentComponent)
  //       return;

  //     const targetState = {
  //       positionX: isNaN(newPosX) ? positionX : newPosX,
  //       positionY: isNaN(newPosY) ? positionY : newPosY,
  //       scale: isNaN(newScale) ? scale : newScale,
  //     };

  //     animateComponent.call(this, {
  //       targetState,
  //       speed,
  //       type,
  //     });
  //   };

  //   resetTransform = () => {
  //     const {
  //       options: { disabled, transformEnabled },
  //     } = this.stateProvider;
  //     if (disabled || !transformEnabled) return;
  //     resetTransformations.call(this);
  //   };

  //   setDefaultState = () => {
  //     this.animation = null;
  //     this.stateProvider = {
  //       ...this.stateProvider,
  //       scale: initialState.scale,
  //       positionX: initialState.positionX,
  //       positionY: initialState.positionY,
  //       ...this.props.defaultValues,
  //     };

  //     this.forceUpdate();
  //   };

  //   //////////
  //   // Setters
  //   //////////

  setComponents = (
    wrapperComponent: HTMLDivElement,
    contentComponent: HTMLDivElement,
  ): void => {
    this.handleInitializeWrapperEvents(wrapperComponent);
    this.handleInitializeContentEvents(contentComponent);
    this.wrapperComponent = wrapperComponent;
    this.contentComponent = contentComponent;
    this.isInitialized = true;
  };

  getTransform = (
    x: number,
    y: number,
    scale: number,
    unit: "%" | "px" = "px",
  ): { webkitTransform: string; transform: string } => {
    return {
      webkitTransform: `translate(${x}${unit}, ${y}${unit}) scale(${scale})`,
      transform: `translate3d(${x}${unit}, ${y}${unit}) scale(${scale})`,
    };
  };

  handleStylesUpdate = (
    newScale?: number,
    posX?: number,
    posY?: number,
  ): void => {
    if (!this.mounted || !this.contentComponent) return;
    const { onZoomChange } = this.props;
    const { scale, positionX, positionY } = this.transformState;

    const x = posX || positionX;
    const y = posY || positionY;
    const s = newScale || scale;
    const { webkitTransform, transform } = this.getTransform(x, y, s);

    this.contentComponent.style.transform = transform;
    this.contentComponent.style.webkitTransform = webkitTransform;

    // force update to inject state to the context
    this.forceUpdate();
    handleCallback(onZoomChange, this.getCurrentState());
  };

  //////////
  // Props
  //////////

  getCurrentState = () => {
    return getValidPropsFromObject(this.transformState);
  };

  render() {
    const value = {
      state: this.getCurrentState(),
      setScale: this.setScale,
      setPositionX: this.setPositionX,
      setPositionY: this.setPositionY,
      zoomIn: this.zoomIn,
      zoomOut: this.zoomOut,
      setTransform: this.setTransform,
      resetTransform: this.resetTransform,
      setDefaultState: this.setDefaultState,
    };

    const { children } = this.props;
    const content = typeof children === "function" ? children(value) : children;

    return (
      <Context.Provider value={{ ...value, setComponents }}>
        {content}
      </Context.Provider>
    );
  }
}

export { Context, StateProvider };
