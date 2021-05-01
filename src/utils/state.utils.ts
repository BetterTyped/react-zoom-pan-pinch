import { ReactZoomPanPinchProps } from "../models/context.model";
import { initialState } from "../constants/state.constants";

export const createState = (
  _props: ReactZoomPanPinchProps,
): NonNullable<ReactZoomPanPinchProps> => {
  return initialState;
};

export const updateDynamicProps = (): ReactZoomPanPinchProps => {
  return {};
};
