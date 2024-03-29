import React from "react";

const BoolIcon = ({ value, icon }) => {
  const onOff = !!value ? "on" : "off";
  const className = `pt-icon-standard pt-icon-${icon} icon-${onOff}`;
  return <span className={className} />;
};

function processWebsite(raw) {
  return raw.replace("/rms/", "/us/");
}

const ProviderName = ({ elt }) => {
  let globe;

  if (elt.websiteURL) {
    let converted = processWebsite(elt.websiteURL);
    globe = (
      <a rel="noopener noreferrer" target="_blank" href={converted}>
        <span className={"pt-icon-globe"} />
      </a>
    );
  } else {
    globe = <span className={"pt-icon-globe icon-off"} />;
  }

  let genderString = elt.gender ? elt.gender : "?";
  let genderClass = `gender gender-${elt.gender ? "on" : "off"}`;

  return (
    <div className={"provider-name-display"}>
      <h3 id={"first"}>{elt.firstName}</h3>
      <h3 id={"middle"}>{elt.middleName}</h3>
      <h3 id={"last"}>{elt.lastName}</h3>

      <h5 className={genderClass}>{genderString}</h5>

      <BoolIcon value={elt.slidingScale} icon={"dollar"} />
      <BoolIcon value={elt.acceptingNewPatients} icon={"person"} />
      <BoolIcon value={elt.freeConsultation} icon={"help"} />
      {globe}

      <a rel="noopener noreferrer" target="_blank" href={`/detail/${elt.id}`}>
        {elt.id}
      </a>
    </div>
  );
};

export default ProviderName;
