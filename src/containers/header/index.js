import React, { Component } from "react";
import { connect } from "react-redux";
import { hello, loadFixtureByName } from "../../state/api/actions";

const APP_NAME = "Provider";

const FIXTURES = [
  "credentials",
  "payors",
  "paymenttypes",
  "modalities",
  "languages",
  "degrees",
  "specialties",
  "directories",
  "plans",
  "licensors"
];

class Header extends Component {
  componentWillMount() {
    this.props.loadUserState();

    // Load ALL the fixtures
    FIXTURES.forEach(x => this.props.loadFixture(x));
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
    loadFixture: loadFixtureByName(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
