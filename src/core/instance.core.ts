import {
  BoundsType,
  LibrarySetup,
  PositionType,
  VelocityType,
  AnimationType,
  ReactZoomPanPinchProps,
  ReactZoomPanPinchState,
  ReactZoomPanPinchRef,
  DeviceType,
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
import { isWheelAllowed, isWheelPanningAllowed } from "./wheel/wheel.utils";
import { isPinchAllowed, isPinchStartAllowed } from "./pinch/pinch.utils";
import { handleCalculateBounds } from "./bounds/bounds.utils";
import {
  handleWheelStart,
  handleWheelZoom,
  handleWheelStop,
  handleWheelPanningStop,
  handleWheelPanningStart,
} from "./wheel/wheel.logic";
import {
  getPaddingValue,
  handleNewPosition,
  isPanningAllowed,
  isPanningStartAllowed,
} from "./pan/panning.utils";
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

  public state: ReactZoomPanPinchState;
  public setup: LibrarySetup;
  public observer?: ResizeObserver;
  public onChangeCallbacks: Set<(ctx: ReactZoomPanPinchRef) => void> =
    new Set();
  public onInitCallbacks: Set<(ctx: ReactZoomPanPinchRef) => void> = new Set();
  public onTransformCallbacks: Set<
    (data: {
      scale: number;
      positionX: number;
      positionY: number;
      previousScale: number;
      ref: ReactZoomPanPinchRef;
    }) => void
  > = new Set();

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
  public isWheelPanning = false;
  public startCoords: StartCoordsType = null;
  public lastTouch: number | null = null;
  // pinch helpers
  public isPinching = false;
  public distance: null | number = null;
  public lastDistance: null | number = null;
  public pinchStartDistance: null | number = null;
  public pinchStartScale: null | number = null;
  public pinchMidpoint: null | PositionType = null;
  public pinchPreviousCenter: null | PositionType = null;
  // double click helpers
  public doubleClickStopEventTimer: ReturnType<typeof setTimeout> | null = null;
  // velocity helpers
  public velocity: VelocityType | null = null;
  public velocityTime: number | null = null;
  public lastMousePosition: PositionType | null = null;
  // animations helpers
  public isAnimating = false;
  public animation: AnimationType | null = null;
  // key press
  public pressedKeys: { [key: string]: boolean } = {};

  constructor(props: ReactZoomPanPinchProps) {
    this.props = props;
    this.setup = createSetup(this.props);
    this.state = createState(this.props);
  }

  mount = () => {
    this.initializeWindowEvents();
  };

  unmount = () => {
    this.cleanupWindowEvents();
  };

  update = (newProps: ReactZoomPanPinchProps) => {
    this.props = newProps;
    handleCalculateBounds(this, this.state.scale);
    this.setup = createSetup(newProps);
  };

  initializeWindowEvents = (): void => {
    const passive = makePassiveEventOption();
    const currentDocument = this.wrapperComponent?.ownerDocument;
    const currentWindow = currentDocument?.defaultView;
    this.wrapperComponent?.addEventListener(
      "wheel",
      this.onWheelPanning,
      passive,
    );
    this.wrapperComponent?.addEventListener(
      "keyup",
      this.setKeyUnPressed,
      passive,
    );
    this.wrapperComponent?.addEventListener(
      "keydown",
      this.setKeyPressed,
      passive,
    );
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
    this.wrapperComponent?.removeEventListener(
      "wheel",
      this.onWheelPanning,
      passive,
    );
    this.wrapperComponent?.removeEventListener(
      "keyup",
      this.setKeyUnPressed,
      passive,
    );
    this.wrapperComponent?.removeEventListener(
      "keydown",
      this.setKeyPressed,
      passive,
    );
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
    this.onInitCallbacks.forEach((callback) => callback(getContext(this)));

    if (centerOnInit) {
      this.setCenter();
      this.observer = new ResizeObserver(() => {
        const currentWidth = contentComponent.offsetWidth;
        const currentHeight = contentComponent.offsetHeight;

        if (currentWidth > 0 || currentHeight > 0) {
          this.onInitCallbacks.forEach((callback) =>
            callback(getContext(this)),
          );
          this.setCenter();

          this.observer?.disconnect();
        }
      });

      // TODO: CHANGE to first interaction?
      // if nothing about the contentComponent has changed after 5 seconds, disconnect the observer
      setTimeout(() => {
        this.observer?.disconnect();
      }, 5000);

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

    handleWheelStart(this, event);
    handleWheelZoom(this, event);
    handleWheelStop(this, event);
  };

  /// ///////
  // Track Pad Panning
  /// ///////

  onWheelPanning = (event: WheelEvent): void => {
    const { onPanning } = this.props;
    const { trackPadPanning } = this.setup;
    const { lockAxisX, lockAxisY } = trackPadPanning;

    const isAllowed = isWheelPanningAllowed(this, event);

    if (!isAllowed) return;

    event.preventDefault();
    event.stopPropagation();

    const { positionX, positionY } = this.state;
    const mouseX = positionX - event.deltaX;
    const mouseY = positionY - event.deltaY;
    const newPositionX = lockAxisX ? positionX : mouseX;
    const newPositionY = lockAxisY ? positionY : mouseY;

    const { sizeX, sizeY } = this.setup.autoAlignment;
    const paddingValueX = getPaddingValue(this, sizeX);
    const paddingValueY = getPaddingValue(this, sizeY);

    if (newPositionX === positionX && newPositionY === positionY) return;

    handleWheelPanningStart(this, event);
    handleNewPosition(
      this,
      newPositionX,
      newPositionY,
      paddingValueX,
      paddingValueY,
    );
    handleCallback(getContext(this), event, onPanning);
    handleWheelPanningStop(this, event);
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

    if (event.button === 0 && !this.setup.panning.allowLeftClickPan) return;
    if (event.button === 1 && !this.setup.panning.allowMiddleClickPan) return;
    if (event.button === 2 && !this.setup.panning.allowRightClickPan) return;

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

    handlePanning(this, event.clientX, event.clientY, DeviceType.MOUSE);
    handleCallback(getContext(this), event, onPanning);
  };

  onPanningStop = (event: MouseEvent | TouchEvent): void => {
    const { velocityDisabled } = this.setup.panning;
    const { onPanningStop } = this.props;

    if (this.isPanning) {
      handlePanningEnd(this, velocityDisabled);
      handleCallback(getContext(this), event, onPanningStop);
    }
  };

  /// ///////
  // Pinch
  /// ///////

  onPinchStart = (event: TouchEvent): void => {
    const { disabled } = this.setup;
    const { onPinchStart } = this.props;

    if (disabled) return;

    const isAllowed = isPinchStartAllowed(this, event);
    if (!isAllowed) return;

    handlePinchStart(this, event);
    handleCancelAnimation(this);
    handleCallback(getContext(this), event, onPinchStart);
  };

  onPinch = (event: TouchEvent): void => {
    const { disabled } = this.setup;
    const { onPinch } = this.props;

    if (disabled) return;

    const isAllowed = isPinchAllowed(this);
    if (!isAllowed) return;

    event.preventDefault();
    event.stopPropagation();

    handlePinchZoom(this, event);
    handleCallback(getContext(this), event, onPinch);
  };

  onPinchStop = (event: TouchEvent): void => {
    const { onPinchStop } = this.props;

    if (this.pinchStartScale) {
      handlePinchStop(this);
      handleCallback(getContext(this), event, onPinchStop);
    }
  };

  /// ///////
  // Touch
  /// ///////

  onTouchPanningStart = (event: TouchEvent): void => {
    const { disabled, doubleClick } = this.setup;
    const { onPanningStart } = this.props;

    if (disabled) return;

    const isDoubleTapAllowed = !doubleClick?.disabled;
    const isDoubleTap = this.lastTouch && +new Date() - this.lastTouch < 200;

    if (isDoubleTapAllowed && isDoubleTap && event.touches.length === 1) {
      this.onDoubleClick(event);
    } else {
      this.lastTouch = +new Date();

      handleCancelAnimation(this);

      const { touches } = event;

      const isPanningAction = touches.length === 1;
      const isPinchAction = touches.length === 2;

      const isAllowed = isPanningStartAllowed(this, event);
      if (isPanningAction) {
        if (!isAllowed) return;
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
      handlePanning(this, touch.clientX, touch.clientY, DeviceType.TOUCH);
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

  isPressingKeys = (
    keys: string[] | ((keys: string[]) => boolean),
  ): boolean => {
    if (typeof keys === "function") {
      return keys(
        Object.entries(this.pressedKeys)
          .filter(([, pressed]) => pressed)
          .map(([key]) => key),
      );
    }
    if (!keys.length) {
      return true;
    }
    return Boolean(keys.every((key) => this.pressedKeys[key]));
  };

  setCenter = (): void => {
    if (this.wrapperComponent && this.contentComponent) {
      const targetState = getCenterPosition(
        this.state.scale,
        this.wrapperComponent,
        this.contentComponent,
      );
      this.setState(
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

  getContext = () => {
    return getContext(this);
  };

  applyTransformation = (): void => {
    if (!this.mounted || !this.contentComponent) return;
    const { scale, positionX, positionY } = this.state;
    const transform = this.handleTransformStyles(positionX, positionY, scale);

    // Detached mode do not apply transformation directly to content component
    if (!this.props.detached) {
      this.contentComponent.style.transform = transform;
    }

    this.onTransformCallbacks.forEach((callback) =>
      callback({
        scale,
        positionX,
        positionY,
        previousScale: this.state.previousScale,
        ref: getContext(this),
      }),
    );
  };

  setState = (scale: number, positionX: number, positionY: number): void => {
    const { onTransform } = this.props;

    if (
      !Number.isNaN(scale) &&
      !Number.isNaN(positionX) &&
      !Number.isNaN(positionY)
    ) {
      if (scale !== this.state.scale) {
        this.state.previousScale = this.state.scale;
        this.state.scale = parseFloat(scale.toFixed(2));
      }

      this.state.positionX = parseFloat(positionX.toFixed(3));
      this.state.positionY = parseFloat(positionY.toFixed(3));

      this.applyTransformation();
      const ctx = getContext(this);
      this.onChangeCallbacks.forEach((callback) => callback(ctx));
      handleCallback(ctx, { scale, positionX, positionY }, onTransform);
    } else {
      console.error("Detected NaN set state values");
    }
  };

  /**
   * Hooks
   */

  onTransform = (
    callback: (data: {
      scale: number;
      positionX: number;
      positionY: number;
      previousScale: number;
      ref: ReactZoomPanPinchRef;
    }) => void,
  ) => {
    if (!this.onTransformCallbacks.has(callback)) {
      this.onTransformCallbacks.add(callback);
    }
    return () => {
      this.onTransformCallbacks.delete(callback);
    };
  };

  onChange = (callback: (ref: ReactZoomPanPinchRef) => void) => {
    if (!this.onChangeCallbacks.has(callback)) {
      this.onChangeCallbacks.add(callback);
    }
    return () => {
      this.onChangeCallbacks.delete(callback);
    };
  };

  onInit = (callback: (ref: ReactZoomPanPinchRef) => void) => {
    if (!this.onInitCallbacks.has(callback)) {
      this.onInitCallbacks.add(callback);
    }
    return () => {
      this.onInitCallbacks.delete(callback);
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
    handleCalculateBounds(this, this.state.scale);
    this.handleInitializeWrapperEvents(wrapperComponent);
    this.handleInitialize(contentComponent);
    this.initializeWindowEvents();
    this.isInitialized = true;
    const ctx = getContext(this);
    handleCallback(ctx, undefined, this.props.onInit);
  };
}
