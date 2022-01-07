import React, { Component } from "react";

import {
  BoundsType,
  LibrarySetup,
  PositionType,
  VelocityType,
  AnimationType,
  ReactZoomPanPinchRef,
  ReactZoomPanPinchProps,
  ReactZoomPanPinchState,
} from "../models";

import {
  getContext,
  createSetup,
  createState,
  handleCallback,
  getTransformStyles,
  makePassiveEventOption,
  getCenterPosition,
} from "../utils";

import { contextInitialState } from "../constants/state.constants";

import { handleCancelAnimation } from "../core/animations/animations.utils";
import { isWheelAllowed } from "../core/wheel/wheel.utils";
import { isPinchAllowed, isPinchStartAllowed } from "../core/pinch/pinch.utils";
import { handleCalculateBounds } from "../core/bounds/bounds.utils";

import {
  handleWheelStart,
  handleWheelZoom,
  handleWheelStop,
} from "../core/wheel/wheel.logic";
import {
  isPanningAllowed,
  isPanningStartAllowed,
} from "../core/pan/panning.utils";
import {
  handlePanning,
  handlePanningEnd,
  handlePanningStart,
} from "../core/pan/panning.logic";
import {
  handlePinchStart,
  handlePinchStop,
  handlePinchZoom,
} from "../core/pinch/pinch.logic";
import {
  handleDoubleClick,
  isDoubleClickAllowed,
} from "../core/double-click/double-click.logic";

type StartCoordsType = { x: number; y: number } | null;

const Context = React.createContext(contextInitialState);

class TransformContext extends Component<
  Omit<ReactZoomPanPinchProps, "ref"> & {
    setRef: (context: ReactZoomPanPinchRef) => void;
  }
> {
  public mounted = true;

  public transformState: ReactZoomPanPinchState = createState(this.props);

  public setup: LibrarySetup = createSetup(this.props);

  // Components
  public wrapperComponent: HTMLDivElement | null = null;
  public contentComponent: HTMLDivElement | null = null;
  // Initialization
  public isInitialized = false;
  public bounds: BoundsType | null = null;
  // wheel helpers
  public previousWheelEvent: WheelEvent | null = null;
  public wheelStopEventTimer: ReturnType<typeof setTimeout> | null = null;
  public wheelAnimationTimer: ReturnType<typeof setTimeout> | null = null;
  // panning helpers
  public isPanning = false;
  public startCoords: StartCoordsType = null;
  public lastTouch: number | null = null;
  // pinch helpers
  public distance: null | number = null;
  public lastDistance: null | number = null;
  public pinchStartDistance: null | number = null;
  public pinchStartScale: null | number = null;
  public pinchMidpoint: null | PositionType = null;
  // velocity helpers
  public velocity: VelocityType | null = null;
  public velocityTime: number | null = null;
  public lastMousePosition: PositionType | null = null;
  // animations helpers
  public animate = false;
  public animation: AnimationType | null = null;
  public maxBounds: BoundsType | null = null;
  // key press
  public pressedKeys: { [key: string]: boolean } = {};

  componentDidMount(): void {
    const passive = makePassiveEventOption();
    // Panning on window to allow panning when mouse is out of component wrapper
    window.addEventListener("mousedown", this.onPanningStart, passive);
    window.addEventListener("mousemove", this.onPanning, passive);
    window.addEventListener("mouseup", this.onPanningStop, passive);
    document.addEventListener("mouseleave", this.clearPanning, passive);
    window.addEventListener("keyup", this.setKeyUnPressed, passive);
    window.addEventListener("keydown", this.setKeyPressed, passive);

    this.handleRef();
  }

  componentWillUnmount(): void {
    const passive = makePassiveEventOption();

    window.removeEventListener("mousedown", this.onPanningStart, passive);
    window.removeEventListener("mousemove", this.onPanning, passive);
    window.removeEventListener("mouseup", this.onPanningStop, passive);
    document.removeEventListener("mouseleave", this.clearPanning, passive);
    window.removeEventListener("keyup", this.setKeyUnPressed, passive);
    window.removeEventListener("keydown", this.setKeyPressed, passive);

    handleCancelAnimation(this);
  }

  componentDidUpdate(oldProps: ReactZoomPanPinchProps): void {
    if (oldProps !== this.props) {
      handleCalculateBounds(this, this.transformState.scale);
      this.setup = createSetup(this.props);
    }
  }

  handleInitializeWrapperEvents = (wrapper: HTMLDivElement): void => {
    // Zooming events on wrapper
    const passive = makePassiveEventOption();

    wrapper.addEventListener("wheel", this.onWheelZoom, passive);
    wrapper.addEventListener("dblclick", this.onDoubleClick, passive);
    wrapper.addEventListener("touchstart", this.onTouchPanningStart, passive);
    wrapper.addEventListener("touchmove", this.onTouchPanning, passive);
    wrapper.addEventListener("touchend", this.onTouchPanningStop, passive);
  };

  handleInitialize = (): void => {
    const { centerOnInit } = this.setup;

    this.applyTransformation();
    this.forceUpdate();

    if (centerOnInit) {
      // this has to be redone once the right solution is found
      // problem is - we need to execute it after mounted component specify it's height / width, images are fetched async so it's tricky
      setTimeout(() => {
        if (this.mounted) {
          this.setCenter();
        }
      }, 50);
      setTimeout(() => {
        if (this.mounted) {
          this.setCenter();
        }
      }, 100);
      setTimeout(() => {
        if (this.mounted) {
          this.setCenter();
        }
      }, 200);
    }
  };

  //////////
  // Zoom
  //////////

  onWheelZoom = (event: WheelEvent): void => {
    const { disabled } = this.setup;
    if (disabled) return;

    const isAllowed = isWheelAllowed(this, event);
    if (!isAllowed) return;

    const keysPressed = this.isPressingKeys(this.setup.wheel.activationKeys);
    if (!keysPressed) return;

    handleWheelStart(this, event);
    handleWheelZoom(this, event);
    handleWheelStop(this, event);
  };

  //////////
  // Pan
  //////////

  onPanningStart = (event: MouseEvent): void => {
    const { disabled } = this.setup;
    const { onPanningStart } = this.props;
    if (disabled) return;

    const isAllowed = isPanningStartAllowed(this, event);
    if (!isAllowed) return;

    const keysPressed = this.isPressingKeys(this.setup.panning.activationKeys);
    if (!keysPressed) return;

    event.preventDefault();
    event.stopPropagation();

    handleCancelAnimation(this);
    handlePanningStart(this, event);
    handleCallback(getContext(this), event, onPanningStart);
  };

  onPanning = (event: MouseEvent): void => {
    const { disabled } = this.setup;
    const { onPanning } = this.props;

    if (disabled) return;

    const isAllowed = isPanningAllowed(this);
    if (!isAllowed) return;

    const keysPressed = this.isPressingKeys(this.setup.panning.activationKeys);
    if (!keysPressed) return;

    event.preventDefault();
    event.stopPropagation();

    handlePanning(this, event.clientX, event.clientY);
    handleCallback(getContext(this), event, onPanning);
  };

  onPanningStop = (event: MouseEvent | TouchEvent): void => {
    const { onPanningStop } = this.props;

    if (this.isPanning) {
      handlePanningEnd(this);
      handleCallback(getContext(this), event, onPanningStop);
    }
  };

  //////////
  // Pinch
  //////////

  onPinchStart = (event: TouchEvent): void => {
    const { disabled } = this.setup;
    const { onPinchingStart, onZoomStart } = this.props;

    if (disabled) return;

    const isAllowed = isPinchStartAllowed(this, event);
    if (!isAllowed) return;

    handlePinchStart(this, event);
    handleCancelAnimation(this);
    handleCallback(getContext(this), event, onPinchingStart);
    handleCallback(getContext(this), event, onZoomStart);
  };

  onPinch = (event: TouchEvent): void => {
    const { disabled } = this.setup;
    const { onPinching, onZoom } = this.props;

    if (disabled) return;

    const isAllowed = isPinchAllowed(this);
    if (!isAllowed) return;

    event.preventDefault();
    event.stopPropagation();

    handlePinchZoom(this, event);
    handleCallback(getContext(this), event, onPinching);
    handleCallback(getContext(this), event, onZoom);
  };

  onPinchStop = (event: TouchEvent): void => {
    const { onPinchingStop, onZoomStop } = this.props;

    if (this.pinchStartScale) {
      handlePinchStop(this);
      handleCallback(getContext(this), event, onPinchingStop);
      handleCallback(getContext(this), event, onZoomStop);
    }
  };

  //////////
  // Touch
  //////////

  onTouchPanningStart = (event: TouchEvent): void => {
    const { disabled } = this.setup;
    const { onPanningStart } = this.props;

    if (disabled) return;

    const isAllowed = isPanningStartAllowed(this, event);

    if (!isAllowed) return;

    const isDoubleTap = this.lastTouch && +new Date() - this.lastTouch < 200;

    if (isDoubleTap && event.touches.length === 1) {
      this.onDoubleClick(event);
    } else {
      this.lastTouch = +new Date();

      handleCancelAnimation(this);

      const { touches } = event;

      const isPanningAction = touches.length === 1;
      const isPinchAction = touches.length === 2;

      if (isPanningAction) {
        handleCancelAnimation(this);
        handlePanningStart(this, event);
        handleCallback(getContext(this), event, onPanningStart);
      }
      if (isPinchAction) {
        this.onPinchStart(event);
      }
    }
  };

  onTouchPanning = (event: TouchEvent): void => {
    const { disabled } = this.setup;
    const { onPanning } = this.props;

    if (this.isPanning && event.touches.length === 1) {
      if (disabled) return;

      const isAllowed = isPanningAllowed(this);
      if (!isAllowed) return;

      event.preventDefault();
      event.stopPropagation();

      const touch = event.touches[0];
      handlePanning(this, touch.clientX, touch.clientY);
      handleCallback(getContext(this), event, onPanning);
    } else if (event.touches.length > 1) {
      this.onPinch(event);
    }
  };

  onTouchPanningStop = (event: TouchEvent): void => {
    this.onPanningStop(event);
    this.onPinchStop(event);
  };

  //////////
  // Double Click
  //////////

  onDoubleClick = (event: MouseEvent | TouchEvent): void => {
    const { disabled } = this.setup;
    if (disabled) return;

    const isAllowed = isDoubleClickAllowed(this, event);
    if (!isAllowed) return;

    handleDoubleClick(this, event);
  };

  //////////
  // Helpers
  //////////

  clearPanning = (event: MouseEvent): void => {
    if (this.isPanning) {
      this.onPanningStop(event);
    }
  };

  setKeyPressed = (e: KeyboardEvent): void => {
    this.pressedKeys[e.key] = true;
  };

  setKeyUnPressed = (e: KeyboardEvent): void => {
    this.pressedKeys[e.key] = false;
  };

  isPressingKeys = (keys: string[]): boolean => {
    if (!keys.length) {
      return true;
    }
    return Boolean(keys.find((key) => this.pressedKeys[key]));
  };

  setComponents = (
    wrapperComponent: HTMLDivElement,
    contentComponent: HTMLDivElement,
  ): void => {
    this.wrapperComponent = wrapperComponent;
    this.contentComponent = contentComponent;
    handleCalculateBounds(this, this.transformState.scale);
    this.handleInitializeWrapperEvents(wrapperComponent);
    this.handleInitialize();
    this.handleRef();
    this.isInitialized = true;
    handleCallback(getContext(this), undefined, this.props.onInit);
  };

  setTransformState = (
    scale: number,
    positionX: number,
    positionY: number,
  ): void => {
    if (!isNaN(scale) && !isNaN(positionX) && !isNaN(positionY)) {
      if (scale !== this.transformState.scale) {
        this.transformState.previousScale = this.transformState.scale;
        this.transformState.scale = scale;
      }
      this.transformState.positionX = positionX;
      this.transformState.positionY = positionY;

      this.applyTransformation();
    } else {
      console.error("Detected NaN set state values");
    }
  };

  setCenter = (): void => {
    if (this.wrapperComponent && this.contentComponent) {
      const targetState = getCenterPosition(
        this.transformState.scale,
        this.wrapperComponent,
        this.contentComponent,
      );
      this.setTransformState(
        targetState.scale,
        targetState.positionX,
        targetState.positionY,
      );
    }
  };

  applyTransformation = (): void => {
    if (!this.mounted || !this.contentComponent) return;
    const { scale, positionX, positionY } = this.transformState;
    const transform = getTransformStyles(positionX, positionY, scale);
    this.contentComponent.style.transform = transform;

    this.handleRef();
  };

  handleRef = (): void => {
    this.props.setRef(getContext(this));
  };

  render(): JSX.Element {
    const value = getContext(this);
    const { children } = this.props;
    const content = typeof children === "function" ? children(value) : children;

    return (
      <Context.Provider
        value={{
          ...this.transformState,
          setComponents: this.setComponents,
          contextInstance: this,
        }}
      >
        {content}
      </Context.Provider>
    );
  }
}

export { Context, TransformContext };
