import React from "react";

const Provider = ({ key, elt }) => (
  <tr key={key}>
    <td>{elt.firstName}</td>
    <td>{elt.lastName}</td>
    <td>LCSW</td>
    <td>Psychotherapy</td>
    <td>Cigna</td>
    <td>
      <a rel="noopener noreferrer" target="_blank" href="https://google.com/">
        <span className={"pt-icon-globe"} />
      </a>
      <a rel="noopener noreferrer" target="_blank" href="https://google.com/">
        <span className={"pt-icon-person"} />
      </a>
    </td>
  </tr>
);

const COLUMNS = [
  "First Name",
  "Last Name",
  "Credential",
  "Specialty",
  "Insurance",
  ""
];

const COLUMN_ELEMENTS = COLUMNS.map(val => <th>{val}</th>);

function ProviderResultList(props) {
  const list = [];

  for (let key in props.elements) {
    let elt = props.elements[key];
    list.push(<Provider key={key} elt={elt} />);
  }

  return (
    <div className="provider-result-list">
      <table className="pt-table pt-striped pt-interactive">
        <thead>
          <tr>{COLUMN_ELEMENTS}</tr>
        </thead>
        <tbody>{list}</tbody>
      </table>
    </div>
  );
}

export default ProviderResultList;
