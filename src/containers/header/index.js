import React, { Component } from "react";
import { connect } from "react-redux";
import {
  credentialsFixture, hello,
  payorsFixture, specialtiesFixture
} from "../../state/api/actions";

const APP_NAME = "Provider";

class Header extends Component {
  componentWillMount() {
    this.props.loadUserState();
    this.props.loadPayorsFixture();
    this.props.loadCredentialsFixture();
    this.props.loadSpecialtiesFixture();
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
    loadPayorsFixture: payorsFixture(dispatch),
    loadCredentialsFixture: credentialsFixture(dispatch),
    loadSpecialtiesFixture: specialtiesFixture(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
