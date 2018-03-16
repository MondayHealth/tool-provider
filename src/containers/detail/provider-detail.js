import React, { Component } from "react";
import { connect } from "react-redux";
import ProviderName from "./provider-name";
import {
  AddressList,
  FixtureList,
  LicenseList,
  LineItem,
  PhoneList,
  PlanList,
  StringList
} from "./line-item";
import "./detail.css";

class ProviderDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      detail: this.props.detail
    };
  }
  componentWillReceiveProps(next) {
    if (next && this.props.detail !== next.detail) {
      this.setState({ detail: next.detail });
    }
  }
  render() {
    if (!this.state.detail || !this.state.detail.hasOwnProperty("id")) {
      return (
        <div className={"provider-detail"}>
          <h4 className={"no-content"}>Nothing to display.</h4>
        </div>
      );
    }

    const elt = this.props.detail;

    const feeDefined = !!(elt.maxFee + elt.maxFee);

    let feeClass = "line-item";
    if (!feeDefined) {
      feeClass += " line-item-undefined";
    }

    return (
      <div className={"provider-detail"}>
        <ProviderName elt={elt} />
        <div id={"fee"} className={feeClass}>
          <span>Fee Range</span> : <span>{elt.minFee}</span>
          -
          <span>{elt.maxFee}</span>
        </div>
        <LineItem elt={elt} zeroIsEmpty={true} name={"beganPractice"} />
        <LineItem elt={elt} zeroIsEmpty={true} name={"yearGraduated"} />
        <LineItem elt={elt} name={"email"} />
        <StringList elt={elt} name={"ageGroups"} />
        <StringList elt={elt} name={"ageRanges"} />
        <FixtureList elt={elt} name={"degrees"} />
        <FixtureList elt={elt} name={"credentials"} />
        <FixtureList elt={elt} name={"specialties"} />
        <FixtureList elt={elt} name={"modalities"} />
        <StringList elt={elt} name={"orientations"} />
        <StringList elt={elt} name={"acceptedPayorComments"} />

        <PhoneList elt={elt} />
        <AddressList elt={elt} />
        <LicenseList elt={elt} />
        <PlanList elt={elt} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    detail: state.detail
  };
};

export default connect(mapStateToProps)(ProviderDetail);
