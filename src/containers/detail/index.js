import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Detail extends Component {
  render() {
    return (
      <div>
        <div>{this.props.params.id}</div>
        <Link to="/">Home!</Link>
      </div>
    );
  }
}

export default connect()(Detail);
