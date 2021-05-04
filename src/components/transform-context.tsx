import React, { Component, useImperativeHandle, useState } from "react";

import {
  LibrarySetup,
  PositionType,
  ReactZoomPanPinchProps,
  ReactZoomPanPinchState,
  VelocityType,
} from "../models";
import { BoundsType } from "../core/bounds/bounds.types";
import { AnimationType } from "../core/animations/animations.types";

import { getContext } from "../utils/context.utils";
import { makePassiveEventOption } from "../utils/event.utils";
import { getTransformStyles } from "../utils/styles.utils";
import { handleCallback } from "../utils/callback.utils";

import {
  initialSetup,
  initialState,
  contextInitialState,
} from "../constants/state.constants";

import { handleCancelAnimation } from "../core/animations/animations.utils";
import { isWheelAllowed } from "../core/zoom/wheel.utils";

import {
  handleWheelStart,
  handleWheelZoom,
  handleWheelStop,
} from "../core/zoom/wheel.logic";

import {
  isPanningAllowed,
  isPanningStartAllowed,
} from "../core/pan/panning.utils";
import {
  handlePanning,
  handlePanningEnd,
  handlePanningStart,
} from "../core/pan/panning.logic";

type StartCoordsType = { x: number; y: number } | null;

const Context = React.createContext(contextInitialState);

class TransformContext extends Component<
  ReactZoomPanPinchProps & { setRef: (values: any) => void }
> {
  public mounted = true;

  public transformState: ReactZoomPanPinchState = initialState;

  public setup: LibrarySetup = initialSetup;

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
  public velocityTime: number | null = null;
  public lastMousePosition: PositionType | null = null;
  public velocity: VelocityType | null = null;
  public velocityModifier: any | null = null;
  public offsetX: number | null = null;
  public offsetY: number | null = null;
  public throttle: ReturnType<typeof setTimeout> | null = null;
  // wheel helpers
  public previousWheelEvent: WheelEvent | null = null;
  public lastScale: number | null = null;
  // animations helpers
  public animate = false;
  public animation: AnimationType | null = null;
  public maxBounds: BoundsType | null = null;
  // wheel event timers
  public wheelStopEventTimer: ReturnType<typeof setTimeout> | null = null;
  public wheelAnimationTimer: ReturnType<typeof setTimeout> | null = null;
  // key press
  public pressedKeys: { [key: string]: boolean } = {};

  componentDidMount(): void {
    const passive = makePassiveEventOption();
    // Panning on window to allow panning when mouse is out of component wrapper
    window.addEventListener("mousedown", this.onPanningStart, passive);
    window.addEventListener("mousemove", this.onPanning, passive);
    window.addEventListener("mouseup", this.onPanningStop, passive);
    window.addEventListener("keyup", this.setKeyUnPressed, passive);
    window.addEventListener("keydown", this.setKeyPressed, passive);

    this.handleRef();
  }

  componentWillUnmount(): void {
    const passive = makePassiveEventOption();

    window.removeEventListener("mousedown", this.onPanningStart, passive);
    window.removeEventListener("mousemove", this.onPanning, passive);
    window.removeEventListener("mouseup", this.onPanningStop, passive);
    window.removeEventListener("keyup", this.setKeyUnPressed, passive);
    window.removeEventListener("keydown", this.setKeyPressed, passive);

    handleCancelAnimation(this);
  }

  // componentDidUpdate(oldProps: ReactZoomPanPinchProps) {
  //   const { dynamicProps } = this.setup;
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
  //     this.applyTransformation();
  //   }
  // }

  handleInitializeWrapperEvents = (wrapper: HTMLDivElement) => {
    // Zooming events on wrapper
    const passive = makePassiveEventOption();

    // this.windowToWrapperScaleX = getWindowScaleX(wrapper);
    // this.windowToWrapperScaleY = getWindowScaleY(wrapper);

    wrapper.addEventListener("wheel", this.onWheelZoom, passive);
    // wrapper.addEventListener("dblclick", this.onDbClick, passive);
    // wrapper.addEventListener("touchstart", this.onTouchPanningStart, passive);
    // wrapper.addEventListener("touchmove", this.onTouchPanning, passive);
    // wrapper.addEventListener("touchend", this.onTouchPanningStop, passive);
  };

  handleInitializeContentEvents = (_content: HTMLDivElement) => {
    // const { centerContent, limitToBounds, limitToWrapper } = this.setup;
    // const { scale, positionX, positionY } = this.transformState;

    // const shouldFitComponent = limitToBounds && !limitToWrapper;
    // const shouldCenterComponent = centerContent && !positionX && !positionY;

    // if (shouldFitComponent || shouldCenterComponent) {
    //   // TODO CHECK THIS LOGIC
    //   const x = 25;
    //   const y = 25;
    //   const s = scale;

    //   const { transform, webkitTransform } = getTransformStyles(x, y, s, "%");

    //   content.style.transform = transform;
    //   content.style.webkitTransform = webkitTransform;

    //   const bounds = handleCalculateBounds(this, scale);

    //   this.transformState.positionX = bounds.minPositionX;
    //   this.transformState.positionY = bounds.minPositionY;
    // }

    this.applyTransformation();
    this.forceUpdate();
  };

  //////////
  // Wheel
  //////////

  onWheelZoom = (event: WheelEvent): void => {
    const { disabled } = this.setup;
    if (disabled) return;

    const isAllowed = isWheelAllowed(this, event);
    if (!isAllowed) return;

    const keysPressed = this.isPressingKeys(this.setup.wheel.activationKeys);
    if (!keysPressed) return;

    handleWheelStart(this);
    handleWheelZoom(this, event);
    handleWheelStop(this, event);
  };

  //////////
  // Panning
  //////////

  onPanningStart = (event: MouseEvent): void => {
    const { disabled } = this.setup;
    if (disabled) return;

    const isAllowed = isPanningStartAllowed(this, event);
    if (!isAllowed) return;

    const keysPressed = this.isPressingKeys(this.setup.wheel.activationKeys);
    if (!keysPressed) return;

    handleCancelAnimation(this);
    handlePanningStart(this, event);
  };

  onPanning = (event: MouseEvent): void => {
    const { disabled } = this.setup;

    if (disabled) return;

    const isAllowed = isPanningAllowed(this);
    if (!isAllowed) return;

    const keysPressed = this.isPressingKeys(this.setup.wheel.activationKeys);
    if (!keysPressed) return;

    event.preventDefault();
    event.stopPropagation();

    // handleVelocityCalculations(this, event);
    handlePanning(this, event.clientX, event.clientY);
  };

  onPanningStop = (): void => {
    if (!this.isMouseDown) return;

    handlePanningEnd(this);
  };

  // //////////
  // // Pinch
  // //////////

  // onPinchStart = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   handlePinchStart(this, event);
  //   handleCancelAnimation(this);
  //   handleCallback(this.setup.onPinchingStart, getContext(this));
  // };

  // onPinch = (event) => {
  //   handleZoomPinch(this, event);
  //   handleCallback(this.setup.onPinching, getContext(this));
  // };

  // onPinchStop = () => {
  //   if (!this.pinchStartScale) return;

  //   handlePinchStop(this, event);
  //   handlePaddingAnimation(this);
  //   handleCallback(this.setup.onPinchingStop, getContext(this));
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

  setKeyPressed = (e: KeyboardEvent): void => {
    this.pressedKeys[e.key] = true;
  };

  setKeyUnPressed = (e: KeyboardEvent): void => {
    this.pressedKeys[e.key] = false;
  };

  isPressingKeys = (requiredKeys: string[]): boolean => {
    if (!requiredKeys.length) {
      return true;
    }
    return Boolean(requiredKeys.find((key) => this.pressedKeys[key]));
  };

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

  applyTransformation = (
    customScale?: number,
    customPosX?: number,
    customPosY?: number,
  ): void => {
    if (!this.mounted || !this.contentComponent) return;
    const { onZoomChange } = this.setup;
    const { scale, positionX, positionY } = this.transformState;

    // TODO check
    const newPositionX = customPosX || positionX;
    const newPositionY = customPosY || positionY;
    const newScale = customScale || scale;
    const { transform } = getTransformStyles(
      newPositionX,
      newPositionY,
      newScale,
    );

    this.contentComponent.style.transform = transform;

    // force update to inject state to the context and avoid async set state causing animations problems
    this.forceUpdate();
    this.handleRef();
    handleCallback(onZoomChange, getContext(this));
  };

  handleRef = () => {
    this.props.setRef(getContext(this));
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

export default React.forwardRef((props: ReactZoomPanPinchProps, ref: any) => {
  const [innerRef, setRef] = useState(null);

  useImperativeHandle(ref, () => innerRef, [innerRef]);

  return <TransformContext {...props} setRef={setRef} />;
});

export { Context, TransformContext };
