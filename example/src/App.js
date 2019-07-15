import React, { Component } from "react";
import { TransformComponent, TransformWrapper } from "react-easy-image-zoom-pan";

export default class App extends Component {
  render() {
    return (
      <div classname="body">
        {/* Header */}
        <header className="masthead text-center text-white">
          <div className="masthead-content">
            <div className="container">
              <h1 className="masthead-heading mb-0">React zoom pan pinch</h1>
              <h2 className="masthead-subheading mb-0">Do it easy way</h2>
              <a href="#" className="btn btn-primary btn-xl rounded-pill mt-5">
                Learn More
              </a>
            </div>
          </div>
          <div className="bg-circle-1 bg-circle" />
          <div className="bg-circle-2 bg-circle" />
          <div className="bg-circle-3 bg-circle" />
          <div className="bg-circle-4 bg-circle" />
        </header>
        <section>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 offset-md-3">
                <div className="p-5">
                  <h2 className="display-4 text-center">Choose example</h2>
                </div>
              </div>
            </div>
            <div className="row align-items-center options">
              <span class="badge badge-pill badge-success">Success</span>
              <span class="badge badge-pill badge-success">Success</span>
              <span class="badge badge-pill badge-success">Success</span>
              <span class="badge badge-pill badge-success">Success</span>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 order-lg-2">
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
