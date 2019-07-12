import React, { Component } from "react";
import { TransformComponent, TransformWrapper } from "react-easy-image-zoom-pan";

export default class App extends Component {
  render() {
    return (
      <TransformWrapper>
        <TransformComponent>
          <img src="https://www.w3schools.com/w3css/img_lights.jpg" alt="test" />
        </TransformComponent>
      </TransformWrapper>
    );
  }
}
