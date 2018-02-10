import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadDetailByID } from "../../state/api/actions";
import "./provider.css";
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
    this.wrapperID = camelCaseToDash(this.props.name);
    this.displayName = titleCase(this.wrapperID.replace("-", " "));
    this.renderedWrapperClass = this.wrapperClasses().join(" ");
  }

  wrapperClasses() {
    return ["line-item"];
  }

  getContent() {
    return this.props.elt[this.props.name];
  }

  render() {
    let computed = this.renderedWrapperClass;

    if (
      !this.props.elt.hasOwnProperty(this.props.name) ||
      (this.props.zeroIsEmpty && this.props.elt[this.props.name] === 0)
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
    if (!this.props.elt[this.props.name].length) {
      ret.push("line-list-empty");
    }
    return ret;
  }
  getContent() {
    const elt = this.props.elt[this.props.name];
    const list = elt.map((value, idx) => <span key={idx}>{value}</span>);
    return <div>{list}</div>;
  }
}

class FixtureList extends StringList {
  getContent() {
    const elt = this.props.elt[this.props.name];
    const decoder = this.props.fixtures[this.props.name];
    const list = elt.map((value, idx) => (
      <span key={idx}>{decoder[value]}</span>
    ));
    return <div>{list}</div>;
  }
}

const BoolIcon = ({ value, icon }) => {
  const onOff = !!value ? "on" : "off";
  const className = `pt-icon-standard pt-icon-${icon} icon-${onOff}`;
  return <span className={className} />;
};

export const ProviderName = ({ elt }) => {
  return (
    <div id={"name"}>
      <h3 id={"first"}>{elt.firstName}</h3>
      <h3 id={"middle"}>{elt.middleName}</h3>
      <h3 id={"last"}>{elt.lastName}</h3>

      <h5 id={"gender"}>{elt.gender ? elt.gender : "?"}</h5>

      <BoolIcon value={elt.slidingScale} icon={"dollar"} />
      <BoolIcon value={elt.acceptingNewPatients} icon={"person"} />
      <BoolIcon value={elt.freeConsultation} icon={"help"} />

      <span id={"id"}>{elt.id}</span>
    </div>
  );
};

const Provider = ({ elt, fixtures }) => {
  let addresses = elt.addresses.map((value, idx) => (
    <div className={"address-item"} key={idx}>
      <div className={"formatted"}>{value.formatted}</div>
      <div className={"address-meta"}>
        <span className={"address-lat"}>{value.lat}</span>
        <span className={"address-lng"}>{value.lng}</span>
        <span className={"directory"}>
          {value.directoryID > -1
            ? fixtures.directories[value.directoryID]
            : "(Payor)"}
        </span>
      </div>
    </div>
  ));

  let licenses = elt.licenses.map((value, idx) => {
    let num = value.number;
    if (value.secondaryNumber > -1) {
      num = value.secondaryNumber + " " + num;
    }
    return (
      <span key={idx}>
        {num} ({fixtures.licensors[value.licensor]})
      </span>
    );
  });

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
      <FixtureList elt={elt} fixtures={fixtures} name={"degrees"} />
      <FixtureList elt={elt} fixtures={fixtures} name={"credentials"} />
      <FixtureList elt={elt} fixtures={fixtures} name={"specialties"} />
      <FixtureList elt={elt} fixtures={fixtures} name={"modalities"} />
      <StringList elt={elt} name={"orientations"} />
      <StringList elt={elt} name={"acceptedPayorComments"} />

      <div className={"line-item"} id={"addresses"}>
        <span>Addresses</span> {addresses}
      </div>
      <div id={"licenses"}>licenses: {licenses}</div>
      <FixtureList elt={elt} fixtures={fixtures} name={"plans"} />
    </div>
  );
};

class Detail extends Component {
  constructor(props) {
    super(props);
    this.props.loadDetailByID(this.props.match.params.id);
  }

  render() {
    let provider = <h4>Loading.</h4>;
    if (this.props.detail.hasOwnProperty("id")) {
      provider = (
        <Provider elt={this.props.detail} fixtures={this.props.fixtures} />
      );
    }

    return (
      <div>
        <Link to="/">Home</Link>
        <div>{provider}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    detail: state.detail,
    fixtures: state.fixtures
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadDetailByID: loadDetailByID(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
