import { ReactZoomPanPinchContext } from "../../models";

export type AnimationType = () => void | number;

export type TargetStateType = {
  contextInstance: ReactZoomPanPinchContext;
  targetState: { scale: number; positionX: number; positionY: number };
  animationTime: number;
  animationName: string;
};
