import {
  BoundsType,
  LibrarySetup,
  PositionType,
  VelocityType,
  AnimationType,
  ReactZoomPanPinchProps,
  ReactZoomPanPinchState,
  ReactZoomPanPinchRef,
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
import { handleCancelAnimation } from "./animations/animations.utils";
import { isWheelAllowed } from "./wheel/wheel.utils";
import { isPinchAllowed, isPinchStartAllowed } from "./pinch/pinch.utils";
import { handleCalculateBounds } from "./bounds/bounds.utils";
import {
  handleWheelStart,
  handleWheelZoom,
  handleWheelStop,
} from "./wheel/wheel.logic";
import { isPanningAllowed, isPanningStartAllowed } from "./pan/panning.utils";
import {
  handlePanning,
  handlePanningEnd,
  handlePanningStart,
} from "./pan/panning.logic";
import {
  handlePinchStart,
  handlePinchStop,
  handlePinchZoom,
} from "./pinch/pinch.logic";
import {
  handleDoubleClick,
  isDoubleClickAllowed,
} from "./double-click/double-click.logic";

type StartCoordsType = { x: number; y: number } | null;

export class ZoomPanPinch {
  public props: ReactZoomPanPinchProps;

  public mounted = true;

  public transformState: ReactZoomPanPinchState;
  public setup: LibrarySetup;
  public observer?: ResizeObserver;
  public onChangeCallbacks: Set<(ctx: ReactZoomPanPinchRef) => void> =
    new Set();

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
  // double click helpers
  public doubleClickStopEventTimer: ReturnType<typeof setTimeout> | null = null;
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

  constructor(props: ReactZoomPanPinchProps) {
    this.props = props;
    this.setup = createSetup(this.props);
    this.transformState = createState(this.props);
  }

  mount = () => {
    this.initializeWindowEvents();
  };

  unmount = () => {
    this.cleanupWindowEvents();
  };

  update = (newProps: ReactZoomPanPinchProps) => {
    handleCalculateBounds(this, this.transformState.scale);
    this.setup = createSetup(newProps);
  };

  initializeWindowEvents = (): void => {
    const passive = makePassiveEventOption();
    const currentDocument = this.wrapperComponent?.ownerDocument;
    const currentWindow = currentDocument?.defaultView;
    // Panning on window to allow panning when mouse is out of component wrapper
    currentWindow?.addEventListener("mousedown", this.onPanningStart, passive);
    currentWindow?.addEventListener("mousemove", this.onPanning, passive);
    currentWindow?.addEventListener("mouseup", this.onPanningStop, passive);
    currentDocument?.addEventListener("mouseleave", this.clearPanning, passive);
    currentWindow?.addEventListener("keyup", this.setKeyUnPressed, passive);
    currentWindow?.addEventListener("keydown", this.setKeyPressed, passive);
  };

  cleanupWindowEvents = (): void => {
    const passive = makePassiveEventOption();
    const currentDocument = this.wrapperComponent?.ownerDocument;
    const currentWindow = currentDocument?.defaultView;
    currentWindow?.removeEventListener(
      "mousedown",
      this.onPanningStart,
      passive,
    );
    currentWindow?.removeEventListener("mousemove", this.onPanning, passive);
    currentWindow?.removeEventListener("mouseup", this.onPanningStop, passive);
    currentDocument?.removeEventListener(
      "mouseleave",
      this.clearPanning,
      passive,
    );
    currentWindow?.removeEventListener("keyup", this.setKeyUnPressed, passive);
    currentWindow?.removeEventListener("keydown", this.setKeyPressed, passive);
    document.removeEventListener("mouseleave", this.clearPanning, passive);

    handleCancelAnimation(this);
    this.observer?.disconnect();
  };

  handleInitializeWrapperEvents = (wrapper: HTMLDivElement): void => {
    // Zooming events on wrapper
    const passive = makePassiveEventOption();

    wrapper.addEventListener("wheel", this.onWheelZoom, passive);
    wrapper.addEventListener("dblclick", this.onDoubleClick, passive);
    wrapper.addEventListener("touchstart", this.onTouchPanningStart, passive);
    wrapper.addEventListener("touchmove", this.onTouchPanning, passive);
    wrapper.addEventListener("touchend", this.onTouchPanningStop, passive);
  };

  handleInitialize = (contentComponent: HTMLDivElement): void => {
    const { centerOnInit } = this.setup;
    this.applyTransformation();

    if (centerOnInit) {
      this.setCenter();
      this.observer = new ResizeObserver(() => {
        this.setCenter();
        this.observer?.disconnect();
      });

      // Start observing the target node for configured mutations
      this.observer.observe(contentComponent);
    }
  };

  /// ///////
  // Zoom
  /// ///////

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

  /// ///////
  // Pan
  /// ///////

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

  /// ///////
  // Pinch
  /// ///////

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

  /// ///////
  // Touch
  /// ///////

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

  /// ///////
  // Double Click
  /// ///////

  onDoubleClick = (event: MouseEvent | TouchEvent): void => {
    const { disabled } = this.setup;
    if (disabled) return;

    const isAllowed = isDoubleClickAllowed(this, event);
    if (!isAllowed) return;

    handleDoubleClick(this, event);
  };

  /// ///////
  // Helpers
  /// ///////

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

  setTransformState = (
    scale: number,
    positionX: number,
    positionY: number,
  ): void => {
    const { onTransformed } = this.props;

    if (
      !Number.isNaN(scale) &&
      !Number.isNaN(positionX) &&
      !Number.isNaN(positionY)
    ) {
      if (scale !== this.transformState.scale) {
        this.transformState.previousScale = this.transformState.scale;
        this.transformState.scale = scale;
      }
      this.transformState.positionX = positionX;
      this.transformState.positionY = positionY;

      const ctx = getContext(this);
      this.onChangeCallbacks.forEach((callback) => callback(ctx));

      handleCallback(ctx, { scale, positionX, positionY }, onTransformed);
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

  handleTransformStyles = (x: number, y: number, scale: number) => {
    if (this.props.customTransform) {
      return this.props.customTransform(x, y, scale);
    }
    return getTransformStyles(x, y, scale);
  };

  applyTransformation = (): void => {
    if (!this.mounted || !this.contentComponent) return;
    const { scale, positionX, positionY } = this.transformState;
    const transform = this.handleTransformStyles(positionX, positionY, scale);
    this.contentComponent.style.transform = transform;
  };

  getContext = () => {
    return getContext(this);
  };

  onChange = (callback: (ref: ReactZoomPanPinchRef) => void) => {
    if (!this.onChangeCallbacks.has(callback)) {
      this.onChangeCallbacks.add(callback);
    }
    return () => {
      this.onChangeCallbacks.delete(callback);
    };
  };

  /**
   * Initialization
   */

  init = (
    wrapperComponent: HTMLDivElement,
    contentComponent: HTMLDivElement,
  ): void => {
    this.cleanupWindowEvents();
    this.wrapperComponent = wrapperComponent;
    this.contentComponent = contentComponent;
    handleCalculateBounds(this, this.transformState.scale);
    this.handleInitializeWrapperEvents(wrapperComponent);
    this.handleInitialize(contentComponent);
    this.initializeWindowEvents();
    this.isInitialized = true;
    handleCallback(getContext(this), undefined, this.props.onInit);
  };
}
