import React, { Component } from "react";
import { connect } from "react-redux";
import ProviderName from "./provider-name";
import "./detail.css";

function camelCaseToDash(myStr) {
  return myStr.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function titleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

class LineItem extends Component {
  constructor(props) {
    super(props);
    this.wrapperID = camelCaseToDash(this.name());
    this.displayName = titleCase(this.wrapperID.replace("-", " "));
    this.renderedWrapperClass = this.wrapperClasses().join(" ");
  }

  name() {
    return this.props.name;
  }

  value() {
    return this.props.elt[this.name()];
  }

  wrapperClasses() {
    return ["line-item"];
  }

  getContent() {
    return this.value();
  }

  render() {
    let computed = this.renderedWrapperClass;

    if (
      !this.props.elt.hasOwnProperty(this.name()) ||
      (this.props.zeroIsEmpty && this.value() === 0)
    ) {
      computed += " line-item-undefined";
    }

    return (
      <div id={this.wrapperID} className={computed}>
        <span>{this.displayName}</span> : {this.getContent()}
      </div>
    );
  }
}

class StringList extends LineItem {
  wrapperClasses() {
    const ret = super.wrapperClasses();
    ret.push("line-list string-list");
    if (!this.value().length) {
      ret.push("line-list-empty");
    }
    return ret;
  }
  getContent() {
    const list = this.value().map((value, idx) => (
      <span key={idx}>{value}</span>
    ));
    return <div>{list}</div>;
  }
}

class FixtureListBase extends StringList {
  getContent() {
    const decoder = this.props.fixtures[this.name()];
    const list = this.value().map((value, idx) => (
      <span key={idx}>{decoder[value]}</span>
    ));
    return <div>{list}</div>;
  }
}

const FixtureList = connect(state => {
  return { fixtures: state.fixtures };
})(FixtureListBase);

class AddressListBase extends StringList {
  name() {
    return "addresses";
  }
  getContent() {
    const directories = this.props.fixtures.directories;
    let addresses = this.props.elt.addresses.map((value, idx) => (
      <div className={"address-item"} key={idx}>
        <div className={"formatted"}>{value.formatted}</div>
        <div className={"address-meta"}>
          <span className={"address-lat"}>{value.lat}</span>
          <span className={"address-lng"}>{value.lng}</span>
          <span className={"directory"}>
            {value.directoryID > -1
              ? directories[value.directoryID]
              : "(Payor)"}
          </span>
        </div>
      </div>
    ));
    return <div>{addresses}</div>;
  }
}

const AddressList = connect(state => {
  return { fixtures: state.fixtures };
})(AddressListBase);

class LicenseListBase extends StringList {
  name() {
    return "licenses";
  }
  getContent() {
    const licensors = this.props.fixtures.licensors;
    let licenses = this.props.elt.licenses.map((value, idx) => {
      let num = value.number;
      if (value.secondaryNumber > -1) {
        num = value.secondaryNumber + " " + num;
      }
      return (
        <span key={idx}>
          {num} ({licensors[value.licensor]})
        </span>
      );
    });
    return <div>{licenses}</div>;
  }
}

const LicenseList = connect(state => {
  return { fixtures: state.fixtures };
})(LicenseListBase);

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
        <StringList elt={elt} name={"ageGroups"} />
        <StringList elt={elt} name={"ageRanges"} />
        <FixtureList elt={elt} name={"degrees"} />
        <FixtureList elt={elt} name={"credentials"} />
        <FixtureList elt={elt} name={"specialties"} />
        <FixtureList elt={elt} name={"modalities"} />
        <StringList elt={elt} name={"orientations"} />
        <StringList elt={elt} name={"acceptedPayorComments"} />

        <AddressList elt={elt} />
        <LicenseList elt={elt} />
        <FixtureList elt={elt} name={"plans"} />
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
