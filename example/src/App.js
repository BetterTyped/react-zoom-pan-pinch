import React, { Component } from "react";
import { TransformComponent, TransformWrapper } from "react-easy-image-zoom-pan";
import zoom_in from "./images/zoom-in.svg";
import zoom_out from "./images/zoom-out.svg";
import zoom_reset from "./images/zoom-reset.svg";
import logo from "./images/logo.png";

export default class App extends Component {
  render() {
    return (
      <div classname="body">
        {/* Header */}
        <header className="masthead text-center text-white">
          <div className="masthead-content">
            <div className="container">
              {/* <h1 className="masthead-heading mb-0">React zoom pan pinch</h1>
              <h2 className="masthead-subheading mb-0">Do it easy way</h2> */}
              <div className="logo">
                <img src={logo} alt="" />
              </div>
            </div>
          </div>
          <a href="#" className="learn btn btn-primary btn-xl rounded-pill mt-5">
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
                  {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <React.Fragment>
                      <div className="tools">
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
                        <TransformComponent>
                          <img src="https://www.w3schools.com/w3css/img_lights.jpg" alt="test" />
                        </TransformComponent>
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
            <p className="m-0 text-center text-white small">Copyright © Your Website 2019</p>
          </div>
          {/* /.container */}
        </footer>
      </div>
    );
  }
}
