import React from "react";
import { connect } from "react-redux";

const Provider = ({ k, elt, credMap, specMap }) => {
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
    <span key={idx}>{value in credMap ? credMap[value] : value}</span>
  ));

  let specialties = elt.specialties.map((value, idx) => (
    <span key={idx}>{value in specMap ? specMap[value] : value}</span>
  ));

  return (
    <tr key={k}>
      <td className={"first-name"}>{elt.firstName}</td>
      <td className={"last-name"}>{elt.lastName}</td>
      <td className={"credentials"}>{credentials}</td>
      <td className={"specialties"}>{specialties}</td>
      <td className={"links"}>
        {globe}
        <a rel="noopener noreferrer" target="_blank" href="https://google.com/">
          <span className={"pt-icon-person"} />
        </a>
      </td>
    </tr>
  );
};

const COLUMNS = ["First Name", "Last Name", "Credential", "Specialty", ""];

const COLUMN_ELEMENTS = COLUMNS.map(val => <th key={val}>{val}</th>);

function ProviderResultList(props) {
  const list = [];

  for (let key in props.elements) {
    let elt = props.elements[key];
    list.push(
      <Provider
        key={key}
        elt={elt}
        credMap={props.fixtures.credentials}
        specMap={props.fixtures.specialties}
      />
    );
  }

  return (
    <div className="provider-result-list">
      <table className="pt-table pt-striped pt-interactive">
        <thead>
          <tr>{COLUMN_ELEMENTS}</tr>
        </thead>
        <tbody className={"results-list"}>{list}</tbody>
      </table>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    fixtures: state.fixtures
  };
};

export default connect(mapStateToProps)(ProviderResultList);
