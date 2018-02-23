import React, { Component } from "react";
import { connect } from "react-redux";
import ProviderName from "../detail/provider-name";
import { loadDetailByID, mouseOverProviderByID } from "../../state/api/actions";

class ProviderListElement extends Component {
  constructor(props) {
    super(props);
    this.id = this.props.elt.id;
    this.clickHandler = this.clickHandler.bind(this);
    this.mouseEnterHandler = this.mouseEnterHandler.bind(this);
    this.mouseLeaveHandler = this.mouseLeaveHandler.bind(this);
  }

  clickHandler() {
    this.props.setDetailID(this.id);
  }

  mouseEnterHandler() {
    this.props.mouseOverProvider(this.id);
  }

  mouseLeaveHandler() {
    this.props.mouseOverProvider(null);
  }

  render() {
    const elt = this.props.elt;
    const fixtures = this.props.fixtures;

    let credentials = elt.credentials.map((value, idx) => (
      <span key={idx}>{fixtures.credentials[value]}</span>
    ));

    const specialties = [];
    const count = Math.min(elt.specialties.length, 5);
    for (let i = 0; i < count; i++) {
      specialties.push(fixtures.specialties[elt.specialties[i]]);
    }
    const orientations = elt.orientations.join(", ");

    let degrees = elt.degrees.map((value, idx) => (
      <span key={idx}>{fixtures.degrees[value]}</span>
    ));

    const className =
      "result-element" + (this.props.selected ? " res-selected" : "");

    return (
      <div
        key={this.props.key}
        className={className}
        onClick={this.clickHandler}
        onMouseEnter={this.mouseEnterHandler}
        onMouseLeave={this.mouseLeaveHandler}
      >
        <ProviderName elt={elt} />
        <div className={"credentials"}>
          {degrees}
          {credentials}
        </div>
        <div className={"specialties"}>{specialties.join(", ")}</div>
        <div className={"orientations"}>{orientations}</div>
        <div className={"links"} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setDetailID: loadDetailByID(dispatch),
    mouseOverProvider: mouseOverProviderByID(dispatch)
  };
};

export default connect(null, mapDispatchToProps)(ProviderListElement);
