import React from "react";
import PropTypes from "prop-types";
import { StateProvider } from "../store/StateContext";

const TransformWrapper = ({ children }) => {
  return <StateProvider>{children}</StateProvider>;
};

TransformWrapper.propTypes = { children: PropTypes.any };

export default TransformWrapper;
