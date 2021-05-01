const zoomIn = (event) => {
  const {
    zoomIn: { disabled, step },
    options,
  } = this.stateProvider;
  const { wrapperComponent, contentComponent } = this.state;

  if (!event) throw Error("Zoom in function requires event prop");
  if (disabled || options.disabled || !wrapperComponent || !contentComponent)
    return;
  handleZoomControls.call(this, 1, step);
};

const zoomOut = (event) => {
  const {
    zoomOut: { disabled, step },
    options,
  } = this.stateProvider;
  const { wrapperComponent, contentComponent } = this.state;

  if (!event) throw Error("Zoom out function requires event prop");
  if (disabled || options.disabled || !wrapperComponent || !contentComponent)
    return;
  handleZoomControls.call(this, -1, step);
};

const handleDbClick = (event) => {
  const {
    options,
    doubleClick: { disabled, step },
  } = this.stateProvider;
  const { wrapperComponent, contentComponent } = this.state;

  if (!event) throw Error("Double click function requires event prop");
  if (disabled || options.disabled || !wrapperComponent || !contentComponent)
    return;
  handleDoubleClick.call(this, event, 1, step);
};

const setScale = (newScale, speed = 200, type = "easeOut") => {
  const {
    positionX,
    positionY,
    scale,
    options: { disabled },
  } = this.stateProvider;
  const { wrapperComponent, contentComponent } = this.state;
  if (disabled || !wrapperComponent || !contentComponent) return;
  const targetState = {
    positionX,
    positionY,
    scale: isNaN(newScale) ? scale : newScale,
  };

  animateComponent.call(this, {
    targetState,
    speed,
    type,
  });
};

const setPositionX = (newPosX, speed = 200, type = "easeOut") => {
  const {
    positionX,
    positionY,
    scale,
    options: { disabled, transformEnabled },
  } = this.stateProvider;
  const { wrapperComponent, contentComponent } = this.state;
  if (disabled || !transformEnabled || !wrapperComponent || !contentComponent)
    return;
  const targetState = {
    positionX: isNaN(newPosX) ? positionX : newPosX,
    positionY,
    scale,
  };

  animateComponent.call(this, {
    targetState,
    speed,
    type,
  });
};

const setPositionY = (newPosY, speed = 200, type = "easeOut") => {
  const {
    positionX,
    scale,
    positionY,
    options: { disabled, transformEnabled },
  } = this.stateProvider;
  const { wrapperComponent, contentComponent } = this.state;
  if (disabled || !transformEnabled || !wrapperComponent || !contentComponent)
    return;

  const targetState = {
    positionX,
    positionY: isNaN(newPosY) ? positionY : newPosY,
    scale,
  };

  animateComponent.call(this, {
    targetState,
    speed,
    type,
  });
};

const setTransform = (
  newPosX,
  newPosY,
  newScale,
  speed = 200,
  type = "easeOut",
) => {
  const {
    positionX,
    positionY,
    scale,
    options: { disabled, transformEnabled },
  } = this.stateProvider;
  const { wrapperComponent, contentComponent } = this.state;
  if (disabled || !transformEnabled || !wrapperComponent || !contentComponent)
    return;

  const targetState = {
    positionX: isNaN(newPosX) ? positionX : newPosX,
    positionY: isNaN(newPosY) ? positionY : newPosY,
    scale: isNaN(newScale) ? scale : newScale,
  };

  animateComponent.call(this, {
    targetState,
    speed,
    type,
  });
};

const resetTransform = () => {
  const {
    options: { disabled, transformEnabled },
  } = this.stateProvider;
  if (disabled || !transformEnabled) return;
  resetTransformations.call(this);
};

const setDefaultState = () => {
  this.animation = null;
  this.stateProvider = {
    ...this.stateProvider,
    scale: initialState.scale,
    positionX: initialState.positionX,
    positionY: initialState.positionY,
    ...this.props.defaultValues,
  };

  this.forceUpdate();
};
