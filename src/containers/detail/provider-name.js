import React from "react";

const BoolIcon = ({ value, icon }) => {
  const onOff = !!value ? "on" : "off";
  const className = `pt-icon-standard pt-icon-${icon} icon-${onOff}`;
  return <span className={className} />;
};

const ProviderName = ({ elt }) => {
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
  return (
    <div className={"provider-name-display"}>
      <h3 id={"first"}>{elt.firstName}</h3>
      <h3 id={"middle"}>{elt.middleName}</h3>
      <h3 id={"last"}>{elt.lastName}</h3>

      <h5 id={"gender"}>{elt.gender ? elt.gender : "?"}</h5>

      <BoolIcon value={elt.slidingScale} icon={"dollar"} />
      <BoolIcon value={elt.acceptingNewPatients} icon={"person"} />
      <BoolIcon value={elt.freeConsultation} icon={"help"} />
      {globe}

      <span id={"id"}>{elt.id}</span>
    </div>
  );
};

export default ProviderName;
