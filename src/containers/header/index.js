import React, { Component } from "react";
import { connect } from "react-redux";
import { hello, payorsFixture } from "../../state/api/actions";

const APP_NAME = "Provider";

class Header extends Component {
  componentWillMount() {
    this.props.loadUserState();
    this.props.loadPayorsFixture();
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

const mapStateToProps = state => {
  return state.userState;
};

const mapDispatchToProps = dispatch => {
  return {
    loadUserState: hello(dispatch),
    loadPayorsFixture: payorsFixture(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
