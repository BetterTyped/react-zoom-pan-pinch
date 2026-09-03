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
  assignRef,
} from "../utils";
import { handleCancelAnimation } from "./animations/animations.utils";
import { handleKeyboardNavigation } from "./keyboard/keyboard.logic";
import {
  handleResizeAlignment,
  handleSizeChange,
  isGestureActive,
  measureSizes,
} from "./resize/resize.logic";
import { MeasuredSizesType } from "./resize/resize.types";
import { calculateFitToView } from "./handlers/handlers.utils";
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
  public panStartPosition: { x: number; y: number } | null = null;
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
  public animationFrame: number | null = null;
  // Settles the promise returned by the running programmatic animation.
  public animationResolve: (() => void) | null = null;
  // init helpers
  public initObserverTimer: ReturnType<typeof setTimeout> | null = null;
  // `centerOnInit`/`fitOnInit` wait for content that has no size yet
  public isInitialLayoutPending = false;
  // resize helpers: last measured sizes and an alignment postponed until the
  // running animation settles
  public measuredSizes: MeasuredSizesType | null = null;
  public isResizeAlignmentPending = false;
  // The alignment animation started by a resize, so further size changes can
  // retarget it instead of waiting for it (compared by identity to
  // `animation`, which is null once it has finished).
  public resizeAnimation: AnimationType | null = null;
  // key press
  public pressedKeys: { [key: string]: boolean } = {};
  // text selection lock while a gesture is active (#467)
  public selectionLock: {
    userSelect: string;
    webkitUserSelect: string;
  } | null = null;

  constructor(props: ReactZoomPanPinchProps) {
    this.props = props;
    this.setup = createSetup(this.props);
    this.state = createState(this.props);
  }

  mount = () => {
    this.mounted = true;
    this.initializeWindowEvents();
  };

  // Marks the instance as gone so pending timers, animation frames and
  // callbacks scheduled before unmount become no-ops.
  unmount = () => {
    this.mounted = false;
    this.cleanupWindowEvents();
  };

  update = (newProps: ReactZoomPanPinchProps) => {
    this.props = newProps;
    // Setup first: bounds depend on the new props (min/max positions,
    // centerZoomedOut, disablePadding).
    this.setup = createSetup(newProps);
    // A gesture owns the bounds until it ends (see `handleResizeAlignment`):
    // replacing them mid-drag makes the next move clamp against a new limit
    // and jump. The gesture start recalculates them anyway.
    if (
      this.wrapperComponent &&
      this.contentComponent &&
      !isGestureActive(this)
    ) {
      handleCalculateBounds(this, this.state.scale);
    }
  };

  clearTimers = (): void => {
    if (this.wheelStopEventTimer) clearTimeout(this.wheelStopEventTimer);
    if (this.wheelAnimationTimer) clearTimeout(this.wheelAnimationTimer);
    if (this.doubleClickStopEventTimer) {
      clearTimeout(this.doubleClickStopEventTimer);
    }
    if (this.initObserverTimer) clearTimeout(this.initObserverTimer);
    this.wheelStopEventTimer = null;
    this.wheelAnimationTimer = null;
    this.doubleClickStopEventTimer = null;
    this.initObserverTimer = null;
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
    currentWindow?.addEventListener("blur", this.handleWindowBlur);
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
    currentWindow?.removeEventListener("blur", this.handleWindowBlur);
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
    this.cleanupWrapperEvents();
    this.clearTimers();
    handleCancelAnimation(this);
    this.unlockTextSelection();
    this.observer?.disconnect();
    this.observer = undefined;
    this.isInitialLayoutPending = false;
    this.isResizeAlignmentPending = false;
    this.resizeAnimation = null;
  };

  cleanupWrapperEvents = (): void => {
    const wrapper = this.wrapperComponent;
    if (!wrapper) return;
    const passive = makePassiveEventOption();

    wrapper.removeEventListener("wheel", this.onWheelZoom, passive);
    wrapper.removeEventListener("dblclick", this.onDoubleClick, passive);
    wrapper.removeEventListener("keydown", this.onKeyboardNavigation, passive);
    wrapper.removeEventListener(
      "touchstart",
      this.onTouchPanningStart,
      passive,
    );
    wrapper.removeEventListener("touchmove", this.onTouchPanning, passive);
    wrapper.removeEventListener("touchend", this.onTouchPanningStop, passive);
  };

  handleInitializeWrapperEvents = (wrapper: HTMLDivElement): void => {
    // Zooming events on wrapper
    const passive = makePassiveEventOption();

    wrapper.addEventListener("wheel", this.onWheelZoom, passive);
    wrapper.addEventListener("dblclick", this.onDoubleClick, passive);
    wrapper.addEventListener("keydown", this.onKeyboardNavigation, passive);
    wrapper.addEventListener("touchstart", this.onTouchPanningStart, passive);
    wrapper.addEventListener("touchmove", this.onTouchPanning, passive);
    wrapper.addEventListener("touchend", this.onTouchPanningStop, passive);
  };

  handleInitialize = (): void => {
    const { centerOnInit, fitOnInit } = this.setup;
    this.applyTransformation();
    this.onInitCallbacks.forEach((callback) => callback(getContext(this)));

    if (centerOnInit || fitOnInit) {
      const applied = this.applyInitialLayout();
      // Content without a size yet (an image still loading) gets its layout
      // applied again by `onSizeChange` once it has one. Once a real layout
      // exists, stop waiting after 5 seconds so a later resize aligns instead
      // of re-centring. Until then keep waiting: in a hidden tab the observer
      // may not deliver for a long time and the first layout must still be
      // the fitted/centred one.
      this.isInitialLayoutPending = true;
      if (this.initObserverTimer) clearTimeout(this.initObserverTimer);
      if (applied) {
        this.initObserverTimer = setTimeout(() => {
          this.initObserverTimer = null;
          this.isInitialLayoutPending = false;
        }, 5000);
      }
    }
  };

  /// ///////
  // Size changes
  /// ///////

  // One observer for the whole lifetime of the instance: it finishes the
  // initial layout for late-sized content and, after that, keeps the
  // transform inside the bounds whenever the content or the wrapper changes
  // size (children re-rendering with another size, images loading, the
  // viewport resizing).
  observeSizes = (
    wrapperComponent: HTMLDivElement,
    contentComponent: HTMLDivElement,
  ): void => {
    this.observer?.disconnect();
    this.observer = undefined;
    this.measuredSizes = measureSizes(wrapperComponent, contentComponent);

    if (typeof ResizeObserver === "undefined") return;

    this.observer = new ResizeObserver(this.onSizeChange);
    this.observer.observe(wrapperComponent);
    this.observer.observe(contentComponent);
  };

  onSizeChange = (): void => {
    const { wrapperComponent, contentComponent } = this;
    if (!this.mounted || !wrapperComponent || !contentComponent) return;

    if (this.isInitialLayoutPending) {
      // Both boxes must be laid out: a wrapper that is sized late (hidden
      // tab, collapsed panel) would otherwise get a fit against a 0px box.
      const hasSize =
        (contentComponent.offsetWidth > 0 ||
          contentComponent.offsetHeight > 0) &&
        wrapperComponent.clientWidth > 0 &&
        wrapperComponent.clientHeight > 0;
      if (!hasSize) return;

      this.isInitialLayoutPending = false;
      if (this.initObserverTimer) clearTimeout(this.initObserverTimer);
      this.initObserverTimer = null;
      this.onInitCallbacks.forEach((callback) => callback(getContext(this)));
      this.applyInitialLayout();
      this.measuredSizes = measureSizes(wrapperComponent, contentComponent);
      handleCalculateBounds(this, this.state.scale);
      return;
    }

    handleSizeChange(this);
  };

  // Called once a gesture or an animation has ended, so a resize seen while
  // it ran is checked against the settled state (it may postpone itself
  // again when another gesture or animation is still running).
  flushResizeAlignment = (): void => {
    if (!this.isResizeAlignmentPending) return;
    this.isResizeAlignmentPending = false;
    handleResizeAlignment(this);
  };

  /// ///////
  // Zoom
  /// ///////

  onWheelZoom = (event: WheelEvent): void => {
    const { disabled } = this.setup;
    if (disabled) return;

    this.syncModifierKeys(event);

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

    this.syncModifierKeys(event);

    const isAllowed = isWheelPanningAllowed(this, event);

    if (!isAllowed) return;

    if (event.cancelable) {
      event.preventDefault();
    }
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
    const { disabled, panning } = this.setup;
    const { onPanningStart } = this.props;
    // With panning off the mousedown is not ours: no pan state, no
    // preventDefault, and native text selection keeps working (#467).
    if (disabled || panning.disabled) return;

    this.syncModifierKeys(event);

    const isAllowed = isPanningStartAllowed(this, event);
    if (!isAllowed) return;

    const keysPressed = this.isPressingKeys(this.setup.panning.activationKeys);
    if (!keysPressed) return;

    if (event.button === 0 && !this.setup.panning.allowLeftClickPan) return;
    if (event.button === 1 && !this.setup.panning.allowMiddleClickPan) return;
    if (event.button === 2 && !this.setup.panning.allowRightClickPan) return;

    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();

    handleCancelAnimation(this);
    handlePanningStart(this, event);
    this.lockTextSelection();
    this.focusForKeyboard();
    handleCallback(getContext(this), event, onPanningStart);
  };

  onPanning = (event: MouseEvent): void => {
    const { disabled } = this.setup;
    const { onPanning } = this.props;

    if (disabled) return;

    this.syncModifierKeys(event);

    // Detect missed mouseup — e.g. when the mouse was released outside an
    // iframe boundary where the host frame swallows the mouseup event.
    if (this.isPanning && event.buttons === 0) {
      this.clearPanning(event);
      return;
    }

    const isAllowed = isPanningAllowed(this);
    if (!isAllowed) return;

    const keysPressed = this.isPressingKeys(this.setup.panning.activationKeys);
    if (!keysPressed) return;

    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();

    handlePanning(this, event.clientX, event.clientY, DeviceType.MOUSE);
    handleCallback(getContext(this), event, onPanning);
  };

  onPanningStop = (event: MouseEvent | TouchEvent): void => {
    const { velocityDisabled } = this.setup.panning;
    const { onPanningStop } = this.props;

    if (this.isPanning) {
      this.unlockTextSelection();
      handlePanningEnd(this, velocityDisabled);
      handleCallback(getContext(this), event, onPanningStop);
      this.flushResizeAlignment();
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

    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();

    handlePinchZoom(this, event);
    handleCallback(getContext(this), event, onPinch);
  };

  onPinchStop = (event: TouchEvent): void => {
    const { onPinchStop } = this.props;

    if (this.pinchStartScale) {
      handlePinchStop(this);
      handleCallback(getContext(this), event, onPinchStop);
      this.flushResizeAlignment();
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
      // Consume the pair so a third quick tap starts a fresh sequence
      // instead of counting as another double tap.
      this.lastTouch = null;
      this.onDoubleClick(event);
    } else {
      this.lastTouch = +new Date();

      handleCancelAnimation(this);

      const { touches } = event;

      const isPanningAction = touches.length === 1;
      const isPinchAction = touches.length === 2;

      const isAllowed = isPanningStartAllowed(this, event);
      if (isPanningAction) {
        if (!isAllowed || this.setup.panning.disabled) return;
        handleCancelAnimation(this);
        handlePanningStart(this, event);
        this.lockTextSelection();
        this.focusForKeyboard();
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

      if (event.cancelable) {
        event.preventDefault();
      }
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

  // When the window loses focus (e.g. user clicks outside an iframe),
  // keyup and mouseup events are swallowed by the parent frame. Clear all
  // tracked state to prevent stale activation keys or ghost panning.
  handleWindowBlur = (): void => {
    this.pressedKeys = {};
    if (this.isPanning) {
      this.isPanning = false;
      this.startCoords = null;
    }
    this.unlockTextSelection();
    this.flushResizeAlignment();
  };

  // Iframe focus problem (e.g. Storybook):
  //
  // When the library runs inside an iframe, keyboard events (keydown/keyup)
  // only reach the iframe's window when it has focus. If the user navigates
  // via the host UI (e.g. Storybook sidebar) the iframe never receives
  // focus, so keydown never fires and activationKeys like Cmd/Ctrl are
  // invisible to pressedKeys.
  //
  // Mouse and wheel events, however, DO reach the iframe regardless of
  // focus — and they carry modifier flags (ctrlKey, metaKey, shiftKey,
  // altKey) that always reflect the real physical key state at event time.
  //
  // We sync those flags into pressedKeys on every interaction event so
  // that activationKeys checks work without requiring iframe focus.
  // Both pressed (true) AND released (false) states must be written;
  // writing only `true` would leave stale keys after release because
  // keyup never fires in an unfocused iframe.
  syncModifierKeys = (event: MouseEvent | WheelEvent | TouchEvent): void => {
    const { ctrlKey, metaKey, shiftKey, altKey } = event;

    if (typeof ctrlKey === "boolean") this.pressedKeys.Control = ctrlKey;
    if (typeof metaKey === "boolean") this.pressedKeys.Meta = metaKey;
    if (typeof shiftKey === "boolean") this.pressedKeys.Shift = shiftKey;
    if (typeof altKey === "boolean") this.pressedKeys.Alt = altKey;
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

  /// ///////
  // Keyboard
  /// ///////

  onKeyboardNavigation = (event: KeyboardEvent): void => {
    handleKeyboardNavigation(this, event);
  };

  // A pan start cancels the mousedown, which also cancels the focus the
  // click would have given the wrapper — so with keyboard navigation on,
  // focus it explicitly or the arrow keys never reach it.
  focusForKeyboard = (): void => {
    const wrapper = this.wrapperComponent;
    if (!wrapper || this.setup.keyboard.disabled) return;
    const active = wrapper.ownerDocument?.activeElement;
    if (active && wrapper.contains(active)) return;
    if (typeof wrapper.focus === "function") {
      wrapper.focus({ preventScroll: true });
    }
  };

  /// ///////
  // Text selection (#467)
  /// ///////

  // The stylesheet no longer disables text selection globally, so users can
  // select and copy content. While a pan gesture is active the wrapper gets
  // an inline `user-select: none` so the drag does not also select text.
  lockTextSelection = (): void => {
    const wrapper = this.wrapperComponent;
    if (!wrapper || this.selectionLock) return;
    this.selectionLock = {
      userSelect: wrapper.style.userSelect,
      webkitUserSelect: wrapper.style.webkitUserSelect,
    };
    wrapper.style.userSelect = "none";
    wrapper.style.webkitUserSelect = "none";
  };

  unlockTextSelection = (): void => {
    const lock = this.selectionLock;
    this.selectionLock = null;
    const wrapper = this.wrapperComponent;
    if (!wrapper || !lock) return;
    wrapper.style.userSelect = lock.userSelect;
    wrapper.style.webkitUserSelect = lock.webkitUserSelect;
  };

  /// ///////
  // Initial layout
  /// ///////

  // `fitOnInit` wins over `centerOnInit` (a fit is always centred). Falls
  // back to centring while the content has no size yet; `onSizeChange`
  // re-runs this once it does. Returns whether both boxes had a size, i.e.
  // whether this was a real initial layout.
  applyInitialLayout = (): boolean => {
    const { fitOnInit } = this.setup;
    const { wrapperComponent, contentComponent } = this;
    const hasSizes =
      !!wrapperComponent &&
      !!contentComponent &&
      wrapperComponent.clientWidth > 0 &&
      wrapperComponent.clientHeight > 0 &&
      (contentComponent.offsetWidth > 0 || contentComponent.offsetHeight > 0);
    if (fitOnInit) {
      const fitted = calculateFitToView(
        this,
        fitOnInit === "cover" ? "cover" : "contain",
      );
      if (fitted) {
        this.setState(fitted.scale, fitted.positionX, fitted.positionY);
        return hasSizes;
      }
    }
    this.setCenter();
    return hasSizes;
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
      const safeScale = Math.max(scale, 1e-7);

      if (safeScale !== this.state.scale) {
        this.state.previousScale = this.state.scale;
        this.state.scale = safeScale;
      }

      this.state.positionX = positionX;
      this.state.positionY = positionY;

      this.applyTransformation();
      const ctx = getContext(this);
      this.onChangeCallbacks.forEach((callback) => callback(ctx));
      handleCallback(
        ctx,
        { scale: this.state.scale, positionX, positionY },
        onTransform,
      );
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
    this.mounted = true;
    this.cleanupWindowEvents();
    this.wrapperComponent = wrapperComponent;
    this.contentComponent = contentComponent;
    handleCalculateBounds(this, this.state.scale);
    this.handleInitializeWrapperEvents(wrapperComponent);
    this.handleInitialize();
    this.observeSizes(wrapperComponent, contentComponent);
    this.initializeWindowEvents();
    this.isInitialized = true;
    const ctx = getContext(this);
    handleCallback(ctx, undefined, this.props.onInit);
    assignRef(this.props.ref, ctx);
  };
}
