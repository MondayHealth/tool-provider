import React, { Component } from "react";
import { connect } from "react-redux";

function camelCaseToDash(myStr) {
  return myStr.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function titleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export class LineItem extends Component {
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

export class StringList extends LineItem {
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

class PlanListBase extends FixtureListBase {
  name() {
    return "plans";
  }

  getContent() {
    const plans = this.props.fixtures.plans;
    const payors = this.props.fixtures.payors;
    const list = this.value().map((value, idx) => {
      const plan = plans[value];
      const payorName = payors[plan.payorId];
      return (
        <span key={idx}>
          {plan.name} ({payorName})
        </span>
      );
    });
    return <div>{list}</div>;
  }
}

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

class PhoneListBase extends StringList {
  name() {
    return "phones";
  }
  getContent() {
    const directories = this.props.fixtures.directories;
    let addresses = this.props.elt.phones.map((value, idx) => (
      <div className={"phone-item"} key={idx}>
        <a className={"number"} href={`tel:${value.number}`}>
          {value.number}
        </a>
        <span className={"directory"}>
          {value.directory > -1 ? directories[value.directory] : "(Payor)"}
        </span>
      </div>
    ));
    return <div>{addresses}</div>;
  }
}

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

const cMap = state => {
  return { fixtures: state.fixtures };
};

export const PlanList = connect(cMap)(PlanListBase);
export const AddressList = connect(cMap)(AddressListBase);
export const PhoneList = connect(cMap)(PhoneListBase);
export const FixtureList = connect(cMap)(FixtureListBase);
export const LicenseList = connect(cMap)(LicenseListBase);
