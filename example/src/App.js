import React, { Component } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import zoom_in from "./images/zoom-in.svg";
import zoom_out from "./images/zoom-out.svg";
import zoom_reset from "./images/zoom-reset.svg";
import logo from "./images/logo.png";

export default class App extends Component {
  state = { type: true };

  render() {
    const { type } = this.state;
    return (
      <div className="body">
        {/* Header */}
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
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12">
                <div className="p-5">
                  <h2 className="display-4 text-center">Simple example</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 order-lg-2 example">
                <TransformWrapper>
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <React.Fragment>
                      <div className="tools">
                        <button
                          className="btn-gradient yellow small btn-type"
                          onClick={() => {
                            resetTransform(0);
                            this.setState(p => ({ type: !p.type }));
                          }}
                        >
                          {type ? "Div example" : "Image example"}
                        </button>
                        <div className="spacer" />
                        <button className="btn-gradient cyan small" onClick={zoomIn}>
                          <img src={zoom_in} alt="" />
                        </button>
                        <button className="btn-gradient blue small" onClick={zoomOut}>
                          <img src={zoom_out} alt="" />
                        </button>
                        <button className="btn-gradient purple small" onClick={resetTransform}>
                          <img src={zoom_reset} alt="" />
                        </button>
                      </div>
                      <div className="element">
                        {type ? (
                          <TransformComponent>
                            <img src="https://www.w3schools.com/w3css/img_lights.jpg" alt="test" />
                          </TransformComponent>
                        ) : (
                          <TransformComponent>
                            <div className="example-text">
                              <h1>Lorem ipsum</h1>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                culpa qui officia deserunt mollit anim id est laborum.
                              </p>
                              <button
                                type="button"
                                onClick={() => alert("You can use nested buttons!")}
                              >
                                Show alert!
                              </button>
                            </div>
                          </TransformComponent>
                        )}
                      </div>
                    </React.Fragment>
                  )}
                </TransformWrapper>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-5 bg-black">
          <div className="container">
            <p className="m-0 text-center text-white small">
              MIT LICENSE ©{" "}
              <a href="https://github.com/prc5" target="_blank" rel="noopener noreferrer">
                prc5
              </a>
            </p>
          </div>
        </footer>
      </div>
    );
  }
}
