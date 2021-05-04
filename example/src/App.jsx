import React, { Component, createRef } from "react";
import { TransformContext, TransformComponent } from "react-zoom-pan-pinch";
import zoom_in from "./images/zoom-in.svg";
import zoom_out from "./images/zoom-out.svg";
import zoom_reset from "./images/zoom-reset.svg";
import logo from "./images/logo.png";
import example_img from "./images/example.jpg";

export default class App extends Component {
  state = {
    type: true,
    limitToBounds: true,
    panningEnabled: true,
    transformEnabled: true,
    pinchEnabled: true,
    limitToWrapper: false,
    disabled: false,
    dbClickEnabled: true,
    lockAxisX: false,
    lockAxisY: false,
    velocityEqualToMove: true,
    enableWheel: true,
    enableTouchPadPinch: true,
    enableVelocity: true,
    limitsOnWheel: false,
  };

  inputRef = createRef();

  toggleSetting = (type) => {
    this.setState((p) => ({ [type]: !p[type] }));
  };

  render() {
    const {
      type,
      limitToBounds,
      panningEnabled,
      transformEnabled,
      pinchEnabled,
      limitToWrapper,
      disabled,
      dbClickEnabled,
      lockAxisX,
      lockAxisY,
      velocityEqualToMove,
      enableWheel,
      enableTouchPadPinch,
      enableVelocity,
      limitsOnWheel,
    } = this.state;
    return (
      <div className="body">
        <header className="masthead text-center text-white">
          <div className="masthead-content">
            <div className="container">
              <div className="logo">
                <img src={logo} alt="" />
              </div>
            </div>
          </div>
          <a
            href="https://github.com/prc5/react-zoom-pan-pinch/"
            className="learn btn btn-primary btn-xl rounded-pill mt-5"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
          <div className="bg-circle-1 bg-circle" />
          <div className="bg-circle-2 bg-circle" />
          <div className="bg-circle-3 bg-circle" />
        </header>
        <section>
          <br />
          <br />
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 order-lg-2 example">
                <TransformContext
                  ref={this.inputRef}
                  limitToBounds={limitToBounds}
                  transformEnabled={transformEnabled}
                  disabled={disabled}
                  limitToWrapper={limitToWrapper}
                  pan={{
                    disabled: !panningEnabled,
                    lockAxisX,
                    lockAxisY,
                    velocityEqualToMove,
                    velocity: enableVelocity,
                  }}
                  pinch={{ disabled: !pinchEnabled }}
                  doubleClick={{ disabled: !dbClickEnabled }}
                  wheel={{
                    wheelEnabled: enableWheel,
                    touchPadEnabled: enableTouchPadPinch,
                    limitsOnWheel,
                  }}
                >
                  {() => (
                    //   {
                    //   zoomIn,
                    //   zoomOut,
                    //   resetTransform,
                    //   setDefaultState,
                    //   positionX,
                    //   positionY,
                    //   scale,
                    //   previousScale,
                    //   options: { limitToBounds, transformEnabled, disabled },
                    //   ...rest
                    // }
                    <React.Fragment>
                      <div className="tools">
                        <button
                          className="btn-gradient yellow small btn-type"
                          data-testid="toggle-button"
                          onClick={() => {
                            this.setState((p) => ({ type: !p.type }));
                          }}
                        >
                          {type ? "Div example" : "Image example"}
                        </button>
                        <div className="spacer" />
                        {/* <button
                          className="btn-gradient cyan small"
                          onClick={zoomIn}
                          data-testid="zoom-in-button"
                        >
                          <img src={zoom_in} alt="" />
                        </button>
                        <button
                          className="btn-gradient blue small"
                          onClick={zoomOut}
                          data-testid="zoom-out-button"
                        >
                          <img src={zoom_out} alt="" />
                        </button> */}
                        {/* <button
                          className="btn-gradient purple small"
                          onClick={resetTransform}
                          data-testid="reset-button"
                        >
                          <img src={zoom_reset} alt="" />
                        </button> */}
                      </div>
                      <div className="element">
                        <TransformComponent>
                          <img
                            className="zoom"
                            src={example_img}
                            alt="example-element"
                          />
                        </TransformComponent>
                      </div>
                    </React.Fragment>
                  )}
                </TransformContext>
                <TransformContext
                  limitToBounds={limitToBounds}
                  transformEnabled={transformEnabled}
                  disabled={disabled}
                  limitToWrapper={limitToWrapper}
                  pan={{
                    disabled: !panningEnabled,
                    lockAxisX,
                    lockAxisY,
                    velocityEqualToMove,
                    velocity: enableVelocity,
                  }}
                  pinch={{ disabled: !pinchEnabled }}
                  doubleClick={{ disabled: !dbClickEnabled }}
                  wheel={{
                    wheelEnabled: enableWheel,
                    touchPadEnabled: enableTouchPadPinch,
                    limitsOnWheel,
                  }}
                >
                  {() => (
                    <React.Fragment>
                      <div className="element">
                        <TransformComponent>
                          <div className="example-text">
                            <h1>Lorem ipsum</h1>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit, sed do eiusmod tempor incididunt ut labore
                              et dolore magna aliqua. Ut enim ad minim veniam,
                              quis nostrud exercitation ullamco laboris nisi ut
                              aliquip ex ea commodo consequat. Duis aute irure
                              dolor in reprehenderit in voluptate velit esse
                              cillum dolore eu fugiat nulla pariatur. Excepteur
                              sint occaecat cupidatat non proident, sunt in
                              culpa qui officia deserunt mollit anim id est
                              laborum.
                            </p>
                            <h1>SVG</h1>
                            <div>
                              <svg width="200px" height="200px">
                                <g transform="translate(100, 100) scale( 1 )">
                                  <circle
                                    r="50px"
                                    vectorEffect="non-scaling-stroke"
                                  />
                                </g>
                                <g transform="translate(100, 100) scale( 0.5 )">
                                  <circle
                                    r="50px"
                                    vectorEffect="non-scaling-stroke"
                                  />
                                </g>
                                <g transform="translate(100, 100) scale( 1.8 )">
                                  <circle
                                    r="50px"
                                    vectorEffect="non-scaling-stroke"
                                  />
                                </g>
                              </svg>
                            </div>
                            <h1>Button</h1>
                            <button
                              type="button"
                              onClick={() =>
                                alert("You can use nested buttons!")
                              }
                              className="btn-3d red small"
                            >
                              Show alert!
                            </button>
                          </div>
                        </TransformComponent>
                      </div>
                    </React.Fragment>
                  )}
                </TransformContext>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-5 bg-black">
          <div className="container">
            <p className="m-0 text-center text-white small">
              MIT LICENSE ©{" "}
              <a
                href="https://github.com/prc5"
                target="_blank"
                rel="noopener noreferrer"
              >
                prc5
              </a>
            </p>
          </div>
        </footer>
      </div>
    );
  }
}
