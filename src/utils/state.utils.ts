import {
  ReactZoomPanPinchProps,
  ReactZoomPanPinchState,
} from "../models/context.model";
import { initialState } from "../constants/state.constants";

export const createState = (
  _props: ReactZoomPanPinchProps,
): ReactZoomPanPinchState => {
  return initialState;
};

export const updateDynamicProps = (
  props: ReactZoomPanPinchProps,
): ReactZoomPanPinchProps => {
  return props;
};
