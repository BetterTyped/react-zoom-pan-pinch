import React, { Component } from "react";
import { TransformComponent, TransformWrapper } from "react-easy-image-zoom-pan";

export default class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="content">
          <div className="element">
            <TransformWrapper>
              {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                <React.Fragment>
                  <div className="tools">
                    <button onClick={zoomIn}>+</button>
                    <button onClick={zoomOut}>-</button>
                    <button onClick={resetTransform}>x</button>
                  </div>
                  <TransformComponent>
                    <img src="https://www.w3schools.com/w3css/img_lights.jpg" alt="test" />
                  </TransformComponent>
                </React.Fragment>
              )}
            </TransformWrapper>
          </div>
        </div>
      </div>
    );
  }
}
