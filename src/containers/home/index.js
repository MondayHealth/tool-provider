import React, { Component } from "react";
import { connect } from "react-redux";
import { userState } from "../../state/api/reducers";

class Home extends Component {
  render() {
    return (
      <div>
        <p>This should list providers.</p>
        <span>{this.props.user.name}</span>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: userState(state)
  };
};

export default connect(mapStateToProps)(Home);
