import React, { Component } from "react";
import { TransformComponent, TransformWrapper } from "react-easy-image-zoom-pan";

export default class App extends Component {
  render() {
    return (
      <TransformWrapper>
        {({ zoomIn, zoomOut, ...rest }) => (
          <React.Fragment>
            <div className="tools">
              <button onClick={zoomIn}>+</button>
              <button onClick={zoomOut}>-</button>
            </div>
            <TransformComponent>
              <img src="https://www.w3schools.com/w3css/img_lights.jpg" alt="test" />
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    );
  }
}
