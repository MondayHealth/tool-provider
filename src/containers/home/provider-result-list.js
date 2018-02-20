import React from "react";
import { connect } from "react-redux";
import ProviderListElement from "./provider-list-element";

function ProviderResultList(props) {
  const list = [];

  for (let key in props.elements) {
    let elt = props.elements[key];
    let selected = props.selected === elt.id;
    list.push(
      <ProviderListElement
        selected={selected}
        key={key}
        elt={elt}
        fixtures={props.fixtures}
      />
    );
  }

  return <div className="provider-result-list">{list}</div>;
}

const mapStateToProps = state => {
  return {
    fixtures: state.fixtures
  };
};

export default connect(mapStateToProps)(ProviderResultList);
