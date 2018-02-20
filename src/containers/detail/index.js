import React, { Component } from "react";
import { connect } from "react-redux";
import { loadDetailByID, loadFixtureByName } from "../../state/api/actions";
import "./provider.css";
import ProviderDetail from "./provider-detail";

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

class Detail extends Component {
  constructor(props) {
    super(props);
    FIXTURES.forEach(x => this.props.loadFixture(x));
    if (this.props.match) {
      this.props.loadDetailByID(this.props.match.params.id);
    }
  }

  render() {
    return (
      <div>
        <ProviderDetail />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadDetailByID: loadDetailByID(dispatch),
    loadFixture: loadFixtureByName(dispatch)
  };
};

export default connect(null, mapDispatchToProps)(Detail);
