export const normalizeArgs = (args: { [key: string]: any }): any => {
  const newArgs = {};

  Object.keys(args).forEach((key) => {
    const normalizedKey = key.split(".");
    const isNested = normalizedKey.length === 2;

    if (isNested) {
      if (!newArgs[normalizedKey[0]]) {
        newArgs[normalizedKey[0]] = {};
      }
      newArgs[normalizedKey[0]][normalizedKey[1]] = args[key];
    } else {
      newArgs[key] = args[key];
    }
  });

  return {
    ...newArgs,
    onTransformed: undefined,
    onWheelStart: undefined,
    onWheel: undefined,
    onWheelStop: undefined,
    onZoomStart: undefined,
    onZoom: undefined,
    onZoomStop: undefined,
    onPanningStart: undefined,
    onPanning: undefined,
    onPanningStop: undefined,
    onPinchStart: undefined,
    onPinch: undefined,
    onPinchStop: undefined,
  };
};
