import { ReactZoomPanPinchState } from "../models";

export type StateSnapshot = Pick<
  ReactZoomPanPinchState,
  "scale" | "positionX" | "positionY"
>;

export const takeSnapshot = (state: ReactZoomPanPinchState): StateSnapshot => ({
  scale: state.scale,
  positionX: state.positionX,
  positionY: state.positionY,
});

export const isSameSnapshot = (
  snapshot: StateSnapshot | null,
  state: ReactZoomPanPinchState,
): boolean =>
  snapshot !== null &&
  snapshot.scale === state.scale &&
  snapshot.positionX === state.positionX &&
  snapshot.positionY === state.positionY;
