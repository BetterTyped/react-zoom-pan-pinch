export type SizeType = {
  width: number;
  height: number;
};

export type PositionType = {
  x: number;
  y: number;
};

export type StateType = { scale: number; positionX: number; positionY: number };

export type VelocityType = {
  velocityX: number;
  velocityY: number;
  total: number;
};

export type BoundsType = {
  minPositionX: number;
  maxPositionX: number;
  minPositionY: number;
  maxPositionY: number;
  scaleWidthFactor: number;
  scaleHeightFactor: number;
};

export type AnimationType = () => void | number;

export enum DeviceType {
  TRACK_PAD = "track_pad",
  MOUSE = "mouse",
  TOUCH = "touch",
}
