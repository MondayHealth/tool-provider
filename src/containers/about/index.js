import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class About extends Component {
  render() {
    return (
      <div>
        <h1>About Us</h1>
        <Link to="/">Go home.</Link>
      </div>
    );
  }
}

export default connect()(About);
