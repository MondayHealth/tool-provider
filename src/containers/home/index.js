import React, { Component } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 100,
      limit: 1000
    };

    this.offsetChanged = this.offsetChanged.bind(this);
  }

  offsetChanged(event) {
    this.setState({ offset: event.target.value });
  }

  render() {
    return (
      <div>
        <p>This should list providers.</p>
        <p>{this.props.email}</p>

        <label>
          Offset
          <input value={this.state.offset} onChange={this.offsetChanged} />
        </label>
      </div>
    );
  }
}

Home.propTypes = {
  offset: PropTypes.number
};

const mapStateToProps = state => {
  return state.userState;
};

export default connect(mapStateToProps)(Home);
