import React from "react";
import { connect } from "react-redux";

import { ProviderName } from "../detail";

const Provider = ({ selected, k, elt, fixtures }) => {
  let globe;

  if (elt.websiteURL) {
    globe = (
      <a rel="noopener noreferrer" target="_blank" href={elt.websiteURL}>
        <span className={"pt-icon-globe"} />
      </a>
    );
  } else {
    globe = <span className={"pt-icon-globe no-website"} />;
  }

  let credentials = elt.credentials.map((value, idx) => (
    <span key={idx}>{fixtures.credentials[value]}</span>
  ));

  let specialties = elt.specialties.map((value, idx) => (
    <span key={idx}>{fixtures.specialties[value]}</span>
  ));

  let degrees = elt.degrees.map((value, idx) => (
    <span key={idx}>{fixtures.degrees[value]}</span>
  ));

  return (
    <div className={selected ? "res-selected" : ""} key={k}>
      <ProviderName elt={elt} />
      <div className={"degrees"}>{degrees}</div>
      <div className={"credentials"}>{credentials}</div>
      <div className={"specialties"}>{specialties}</div>
      <td className={"links"}>
        {globe}
        <a rel="noopener noreferrer" target="_blank" href={"/detail/" + elt.id}>
          <span className={"pt-icon-person"} />
        </a>
      </td>
    </div>
  );
};

function ProviderResultList(props) {
  const list = [];

  for (let key in props.elements) {
    let elt = props.elements[key];
    let selected = props.selected === elt.id;
    list.push(
      <Provider
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
