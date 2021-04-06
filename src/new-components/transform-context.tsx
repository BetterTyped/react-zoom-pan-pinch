import React, { Component } from "react";

import { handleCancelAnimation } from "../new-core/animations/animations.utils";
import { handleCallback } from "../new-utils/callback.utils";

import { contextInitialState, getContext } from "../new-utils/context.utils";
import { makePassiveEventOption } from "../new-utils/event.utils";
import { cancelTimeout } from "../new-utils/helpers.utils";
import { createState, updateState } from "../new-utils/state.utils";
import { getTransformStyles } from "../new-utils/styles.utils";

type StartCoordsType = { x: number; y: number } | null;

const Context = React.createContext(contextInitialState);

const wheelStopEventTime = 180;
const wheelAnimationTime = 100;

class TransformContext extends Component<any, any> {
  public mounted = true;

  public transformState = createState.call(this, this.props);

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
    const passive = makePassiveEventOption();

    // Panning on window to allow panning when mouse is out of component wrapper
    window.addEventListener("mousedown", this.onPanningStart, passive);
    window.addEventListener("mousemove", this.onPanning, passive);
    window.addEventListener("mouseup", this.onPanningStop, passive);
  }

  componentWillUnmount() {
    const passive = makePassiveEventOption();

    window.removeEventListener("mousedown", this.onPanningStart, passive);
    window.removeEventListener("mousemove", this.onPanning, passive);
    window.removeEventListener("mouseup", this.onPanningStop, passive);

    handleCancelAnimation.call(this);
  }

  componentDidUpdate(oldProps) {
    const { dynamicProps } = this.props;
    const { scale, options } = this.transformState;
    const { limitToWrapper } = options;

    const hasPropsChanged = oldProps.dynamicProps !== dynamicProps;
    const isContinuedUpdate = Boolean(oldProps.dynamicProps);

    // set bound for animations
    if (this.isInitialized || hasPropsChanged) {
      handleRecalculateBounds.call(this, scale, limitToWrapper);
    }

    if (isContinuedUpdate && hasPropsChanged) {
      this.animation = null;
      this.transformState = updateState.call(this, dynamicProps);
      this.handleStylesUpdate();
    }
  }

  handleInitializeWrapperEvents = (wrapper: HTMLDivElement) => {
    // Zooming events on wrapper
    const passive = makePassiveEventOption();

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

      const { transform, webkitTransform } = getTransformStyles(x, y, s, "%");

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
    const isAllowed = isZoomAllowed.call(this, event);
    if (!isAllowed) return;

    const { scale } = this.transformState;
    const { onWheelStart, onWheel, onWheelStop } = this.props;

    // Wheel start event
    if (!this.wheelStopEventTimer) {
      this.lastScale = scale;
      handleCancelAnimation.call(this);
      handleCallback(onWheelStart, getContext.call(this));
    }

    // Wheel event
    handleWheelZoom.call(this, event);
    handleCallback(onWheel, getContext.call(this));
    this.handleStylesUpdate();
    // TODO Somtehing wrong in here
    this.previousWheelEvent = event;
    this.lastScale = this.transformState.scale;

    // fire animation
    cancelTimeout(this.wheelAnimationTimer);
    this.wheelAnimationTimer = setTimeout(() => {
      if (!this.mounted) return;
      handlePaddingAnimation.call(this, event);
      this.wheelAnimationTimer = null;
    }, wheelAnimationTime);

    // Wheel stop event
    const hasStoppedZooming = handleWheelStop.call(this, event);
    if (hasStoppedZooming) {
      cancelTimeout(this.wheelStopEventTimer);
      this.wheelStopEventTimer = setTimeout(() => {
        if (!this.mounted) return;
        handleCallback(onWheelStop, getContext.call(this));
        this.wheelStopEventTimer = null;
      }, wheelStopEventTime);
    }
  };

  //////////
  // Panning
  //////////

  handleSetUpPanning = (event: TouchEvent): void => {
    const { touches } = event;
    const { positionX, positionY } = this.transformState;

    this.isMouseDown = true;

    // Mobile panning with touch
    if (touches && touches.length === 1) {
      const x = touches[0].clientX;
      const y = touches[0].clientY;
      this.startCoords = { x: x - positionX, y: y - positionY };
    }
    // Desktop panning with mouse
    if (!touches) {
      const x = touches[0].clientX;
      const y = touches[0].clientY;
      this.startCoords = { x: x - positionX, y: y - positionY };
    }
  };

  onPanningStart = (event: TouchEvent): void => {
    const { scale, options } = this.transformState;
    const { limitToWrapper } = options;

    const isAllowed = isPanningStartAllowed.call(this, event);
    if (!isAllowed) return;

    handleCancelAnimation.call(this);
    handleRecalculateBounds.call(this, scale, limitToWrapper);
    handleSetUpPanning.call(this, event);
    handleCallback(this.props.onPanningStart, getContext.call(this));
  };

  onPanning = (event: MouseEvent) => {
    const isPanningAllowed = this.getPanningAllowedStatus(event);
    if (!isPanningAllowed) return;
    event.preventDefault();
    event.stopPropagation();
    handleVelocity.call(this, event);
    handlePanning.call(this, event);
    handleCallback(this.props.onPanning, getContext.call(this));
  };

  onPanningStop = (): void => {
    if (!this.isMouseDown) return;
    handleCallback(this.props.onPanningStop, getContext.call(this));
    handleVelocityStart.call(this);
    handlePanningAnimation.call(this);
  };

  //////////
  // Pinch
  //////////

  onPinchStart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    handlePinchStart.call(this, event);
    handleCancelAnimation.call(this);
    handleCallback(this.props.onPinchingStart, getContext.call(this));
  };

  onPinch = (event) => {
    handleZoomPinch.call(this, event);
    handleCallback(this.props.onPinching, getContext.call(this));
  };

  onPinchStop = () => {
    if (!this.pinchStartScale) return;

    handlePinchStop.call(this, event);
    handlePaddingAnimation.call(this);
    handleCallback(this.props.onPinchingStop, getContext.call(this));
  };

  //////////
  // Touch Events
  //////////

  onTouchPanningStart = (event: TouchEvent) => {
    const isAllowed = getTouchPanningStartAllowed.call(this);
    if (!isAllowed) return;

    handleCancelAnimation.call(this);

    const isPanningAction = touches?.length === 1;
    const isPinchAction = touches?.length === 2;

    if (isPanningAction) return this.handleStartPanning(event);
    if (isPinchAction) return this.handlePinchStart(event);
  };

  onTouchPanning = (event: TouchEvent) => {
    const { pan, pinch, options } = this.transformState;
    const isAllowed = options.disabled;
    if (!isAllowed) return;

    const isPanningAction = !pan.disabled && event.touches.length === 1;
    const isPinchAction = !pinch.disabled && event.touches.length === 2;

    if (isPanningAction) return this.handlePanning(event);
    if (isPinchAction) return this.handlePinch(event);
  };

  onTouchPanningStop = () => {
    this.onPanningStop();
    this.onPinchStop();
  };

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
    handleCallback(onZoomChange, getContext.call(this));
  };

  render() {
    const value = getContext.call(this);
    const { children } = this.props;
    const content = typeof children === "function" ? children(value) : children;

    return (
      <Context.Provider value={{ ...value, setComponents: this.setComponents }}>
        {content}
      </Context.Provider>
    );
  }
}

type ContextMethodsType = typeof TransformContext.prototype;

export { Context, TransformContext, ContextMethodsType };
