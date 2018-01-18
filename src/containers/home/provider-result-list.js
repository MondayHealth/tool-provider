import React from "react";

function ProviderResultList(props) {
  const list = [];

  for (let key in props.elements) {
    let elt = props.elements[key];
    list.push(
      <li key={key}>
        {elt.firstName} {elt.lastName}
      </li>
    );
  }

  return <div className="provider-result-list">{list}</div>;
}

export default ProviderResultList;
