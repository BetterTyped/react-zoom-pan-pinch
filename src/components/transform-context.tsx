import React, { Component } from "react";

import { ReactZoomPanPinchProps, ReactZoomPanPinchState } from "../models";
import { BoundsType } from "../core/bounds/bounds.types";
import { AnimationType } from "../core/animations/animations.types";

import { getContext } from "../utils/context.utils";
import { makePassiveEventOption } from "../utils/event.utils";
import { cancelTimeout } from "../utils/helpers.utils";
import { getTransformStyles } from "../utils/styles.utils";
import { handleCallback } from "../utils/callback.utils";

import {
  contextInitialState,
  initialState,
} from "../constants/state.constants";

import { handleCancelAnimation } from "../core/animations/animations.utils";
import {
  handleWheelZoom,
  handleWheelZoomStop,
  isWheelAllowed,
} from "../core/zoom/zoom.utils";
import { handleCalculateBounds } from "../core/bounds/bounds.utils";

type StartCoordsType = { x: number; y: number } | null;

const Context = React.createContext(contextInitialState);

const wheelStopEventTime = 180;
const wheelAnimationTime = 100;

class TransformContext extends Component<ReactZoomPanPinchProps> {
  public mounted = true;

  public transformState: ReactZoomPanPinchState = initialState;

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
  public bounds: BoundsType | null = null;
  // velocity helpers
  public velocityTime = null;
  public lastMousePosition = null;
  public velocity = null;
  public offsetX = null;
  public offsetY = null;
  public throttle = false;
  // wheel helpers
  public previousWheelEvent: WheelEvent | null = null;
  public lastScale: number | null = null;
  // animations helpers
  public animate = null;
  public animation: AnimationType | null = null;
  public maxBounds = null;
  // wheel event timers
  public wheelStopEventTimer: ReturnType<typeof setTimeout> | null = null;
  public wheelAnimationTimer: ReturnType<typeof setTimeout> | null = null;

  componentDidMount() {
    // const passive = makePassiveEventOption();
    // // Panning on window to allow panning when mouse is out of component wrapper
    // window.addEventListener("mousedown", this.onPanningStart, passive);
    // window.addEventListener("mousemove", this.onPanning, passive);
    // window.addEventListener("mouseup", this.onPanningStop, passive);
  }

  componentWillUnmount() {
    // const passive = makePassiveEventOption();

    // window.removeEventListener("mousedown", this.onPanningStart, passive);
    // window.removeEventListener("mousemove", this.onPanning, passive);
    // window.removeEventListener("mouseup", this.onPanningStop, passive);

    handleCancelAnimation(this);
  }

  // componentDidUpdate(oldProps: ReactZoomPanPinchProps) {
  //   const { dynamicProps } = this.props;
  //   const { scale, limitToWrapper } = this.transformState;

  //   const hasPropsChanged = oldProps.dynamicProps !== dynamicProps;
  //   const isContinuedUpdate = Boolean(oldProps.dynamicProps);

  //   // set bound for animations
  //   if (this.isInitialized || hasPropsChanged) {
  //     handleRecalculateBounds(this, scale, limitToWrapper);
  //   }

  //   if (isContinuedUpdate && hasPropsChanged) {
  //     this.animation = null;
  //     this.transformState = updateState(this, dynamicProps);
  //     this.handleStylesUpdate();
  //   }
  // }

  handleInitializeWrapperEvents = (wrapper: HTMLDivElement) => {
    // Zooming events on wrapper
    const passive = makePassiveEventOption();

    // this.windowToWrapperScaleX = getWindowScaleX(wrapper);
    // this.windowToWrapperScaleY = getWindowScaleY(wrapper);

    wrapper.addEventListener("wheel", this.onZoom, passive);
    // wrapper.addEventListener("dblclick", this.onDbClick, passive);
    // wrapper.addEventListener("touchstart", this.onTouchPanningStart, passive);
    // wrapper.addEventListener("touchmove", this.onTouchPanning, passive);
    // wrapper.addEventListener("touchend", this.onTouchPanningStop, passive);
  };

  handleInitializeContentEvents = (content: HTMLDivElement) => {
    const {
      positionX,
      positionY,
      centerContent,
      limitToBounds,
      limitToWrapper,
    } = this.props;

    const { scale } = this.transformState;

    const shouldFitComponent = limitToBounds && !limitToWrapper;
    const shouldCenterComponent = centerContent && !positionX && !positionY;

    if (shouldFitComponent || shouldCenterComponent) {
      // TODO CHECK THIS LOGIC
      const x = 25;
      const y = 25;
      const s = scale;

      const { transform, webkitTransform } = getTransformStyles(x, y, s, "%");

      content.style.transform = transform;
      content.style.webkitTransform = webkitTransform;

      const bounds = handleCalculateBounds(this, scale, false);

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
    const { disabled } = this.props;
    if (!disabled) return;

    const isAllowed = isWheelAllowed(this, event, this.props);
    if (!isAllowed) return;

    const { scale } = this.transformState;
    const { onWheelStart, onWheel, onWheelStop } = this.props;

    // Wheel start event
    if (!this.wheelStopEventTimer) {
      this.lastScale = scale;
      handleCancelAnimation(this);
      handleCallback(onWheelStart, getContext(this));
    }

    // Wheel event
    handleWheelZoom(this, event);
    handleCallback(onWheel, getContext(this));
    this.handleStylesUpdate();
    // TODO Somtehing wrong in here
    this.previousWheelEvent = event;
    this.lastScale = this.transformState.scale;

    // fire animation
    cancelTimeout(this.wheelAnimationTimer);
    this.wheelAnimationTimer = setTimeout(() => {
      if (!this.mounted) return;
      // handlePaddingAnimation(this, event);
      this.wheelAnimationTimer = null;
    }, wheelAnimationTime);

    // Wheel stop event
    const hasStoppedZooming = handleWheelZoomStop(this, event);
    if (hasStoppedZooming) {
      cancelTimeout(this.wheelStopEventTimer);
      this.wheelStopEventTimer = setTimeout(() => {
        if (!this.mounted) return;
        handleCallback(onWheelStop, getContext(this));
        this.wheelStopEventTimer = null;
      }, wheelStopEventTime);
    }
  };

  // //////////
  // // Panning
  // //////////

  // handleSetUpPanning = (event: TouchEvent): void => {
  //   const { touches } = event;
  //   const { positionX, positionY } = this.transformState;

  //   this.isMouseDown = true;

  //   // Mobile panning with touch
  //   if (touches && touches.length === 1) {
  //     const x = touches[0].clientX;
  //     const y = touches[0].clientY;
  //     this.startCoords = { x: x - positionX, y: y - positionY };
  //   }
  //   // Desktop panning with mouse
  //   if (!touches) {
  //     const x = touches[0].clientX;
  //     const y = touches[0].clientY;
  //     this.startCoords = { x: x - positionX, y: y - positionY };
  //   }
  // };

  // onPanningStart = (event: TouchEvent): void => {
  //   const { scale, options } = this.transformState;
  //   const { limitToWrapper } = options;

  //   const isAllowed = isPanningStartAllowed(this, event);
  //   if (!isAllowed) return;

  //   handleCancelAnimation(this);
  //   handleRecalculateBounds(this, scale, limitToWrapper);
  //   handleSetUpPanning(this, event);
  //   handleCallback(this.props.onPanningStart, getContext(this));
  // };

  // onPanning = (event: MouseEvent) => {
  //   const isPanningAllowed = this.getPanningAllowedStatus(event);
  //   if (!isPanningAllowed) return;
  //   event.preventDefault();
  //   event.stopPropagation();
  //   handleVelocity(this, event);
  //   handlePanning(this, event);
  //   handleCallback(this.props.onPanning, getContext(this));
  // };

  // onPanningStop = (): void => {
  //   if (!this.isMouseDown) return;
  //   handleCallback(this.props.onPanningStop, getContext(this));
  //   handleVelocityStart(this);
  //   handlePanningAnimation(this);
  // };

  // //////////
  // // Pinch
  // //////////

  // onPinchStart = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   handlePinchStart(this, event);
  //   handleCancelAnimation(this);
  //   handleCallback(this.props.onPinchingStart, getContext(this));
  // };

  // onPinch = (event) => {
  //   handleZoomPinch(this, event);
  //   handleCallback(this.props.onPinching, getContext(this));
  // };

  // onPinchStop = () => {
  //   if (!this.pinchStartScale) return;

  //   handlePinchStop(this, event);
  //   handlePaddingAnimation(this);
  //   handleCallback(this.props.onPinchingStop, getContext(this));
  // };

  // //////////
  // // Touch Events
  // //////////

  // onTouchPanningStart = (event: TouchEvent) => {
  //   const isAllowed = getTouchPanningStartAllowed(this);
  //   if (!isAllowed) return;

  //   handleCancelAnimation(this);

  //   const isPanningAction = touches?.length === 1;
  //   const isPinchAction = touches?.length === 2;

  //   if (isPanningAction) return this.handleStartPanning(event);
  //   if (isPinchAction) return this.handlePinchStart(event);
  // };

  // onTouchPanning = (event: TouchEvent) => {
  //   const { pan, pinch, options } = this.transformState;
  //   const isAllowed = options.disabled;
  //   if (!isAllowed) return;

  //   const isPanningAction = !pan.disabled && event.touches.length === 1;
  //   const isPinchAction = !pinch.disabled && event.touches.length === 2;

  //   if (isPanningAction) return this.handlePanning(event);
  //   if (isPinchAction) return this.handlePinch(event);
  // };

  // onTouchPanningStop = () => {
  //   this.onPanningStop();
  //   this.onPinchStop();
  // };

  //////////
  // Helpers
  //////////

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

  handleStylesUpdate = (
    newScale?: number,
    posX?: number,
    posY?: number,
  ): void => {
    if (!this.mounted || !this.contentComponent) return;
    const { onZoomChange } = this.props;
    const { scale, positionX, positionY } = this.transformState;

    // TODO check
    const x = posX || positionX;
    const y = posY || positionY;
    const s = newScale || scale;
    const { webkitTransform, transform } = getTransformStyles(x, y, s);

    this.contentComponent.style.transform = transform;
    this.contentComponent.style.webkitTransform = webkitTransform;

    // force update to inject state to the context and avoid async set state causing animations problems
    this.forceUpdate();
    handleCallback(onZoomChange, getContext(this));
  };

  render() {
    const value = getContext(this);
    const { children } = this.props;
    const content = typeof children === "function" ? children(value) : children;

    return (
      <Context.Provider
        value={{
          ...this.transformState,
          wrapperClass: this.props.wrapperClass || "",
          contentClass: this.props.contentClass || "",
          setComponents: this.setComponents,
        }}
      >
        {content}
      </Context.Provider>
    );
  }
}

export { Context, TransformContext };
