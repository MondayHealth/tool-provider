import React, { Component } from "react";
import { connect } from "react-redux";
import { hello } from "../../state/api/actions";

const APP_NAME = "Provider";

class Header extends Component {
  componentWillMount() {
    this.props.loadUserState();
  }

  render() {
    return (
      <header className="App-header">
        <h2 id="app-name">{APP_NAME}</h2>
        <h4 id="name-display">{this.props.name || "(None)"}</h4>
      </header>
    );
  }
}

const mapToProps = state => {
  return state.userState;
};

const mapToDispatch = dispatch => {
  return {
    loadUserState: hello(dispatch)
  };
};

export default connect(mapToProps, mapToDispatch)(Header);
