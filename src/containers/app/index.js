import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import About from "../about";
import Home from "../home";
import Header from "../header";
import { googleMapsLoaded } from "../../state/api/actions";
import { connect } from "react-redux";

const MAP_INIT_CB_NAME = "googleMapsInitCallback";

class App extends Component {
  constructor(props) {
    super(props);
    this.googleMapsScript = null;
  }

  initGoogleMapsAPI() {
    delete window[MAP_INIT_CB_NAME];
    console.log("Initialized maps.");
    this.props.googleMapsLoaded();
  }

  installGoogleMapsAPI() {
    console.assert(!this.googleMapsScript, "Double install.");

    const KEY = "AIzaSyAtGlev0oDtHGc3DSZZfkjZZyMzje5zUEg";
    const PARAMS = `key=${KEY}&callback=${MAP_INIT_CB_NAME}&libraries=geometry`;
    const script = document.createElement("script");

    script.defer = true;
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?${PARAMS}`;

    window[MAP_INIT_CB_NAME] = this.initGoogleMapsAPI.bind(this);

    document.body.appendChild(script);

    this.googleMapsScript = script;
  }

  componentWillMount() {
    this.installGoogleMapsAPI();
  }

  componentWillUnmount() {
    if (this.googleMapsScript) {
      this.googleMapsScript.remove();
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <main>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
        </main>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    googleMapsLoaded: googleMapsLoaded(dispatch)
  };
};

export default connect(null, mapDispatchToProps)(App);
