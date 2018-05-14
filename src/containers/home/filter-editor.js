import React, { Component } from "react";
import { connect } from "react-redux";
import { TopToaster } from "../../toaster";
import { Intent, RangeSlider, Slider, Spinner } from "@blueprintjs/core";
import { geocode } from "../../util/gmaps";
import {
  FixtureMultiSelect,
  FixtureSelect,
  PayorSelect
} from "./fixture-selects";

const CheckBox = ({ defaultValue, onChange, text }) => (
  <label className="pt-control pt-checkbox pt-large">
    <input type="checkbox" defaultValue={defaultValue} onChange={onChange} />
    <span className="pt-control-indicator" />
    {text}
  </label>
);

const GENDER_OPTIONS = [
  <option key={"0"} value={"0"}>
    None
  </option>,
  <option key={"1"} value={"1"}>
    Female
  </option>,
  <option key={"2"} value={"2"}>
    Male
  </option>
];

class FilterEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payor: 0,
      plan: 0,
      specialties: [],
      credentials: [],
      degrees: [],
      gender: 0,
      language: 0,
      modality: 0,
      feeRange: [0, 500],
      processingAddress: false,
      addressInputValue: "",
      coordinate: null,
      addressInputValidity: null,
      radius: 1,
      practiceAge: 0,
      contact: false,
      freeConsult: false,
      website: false,
      freeInputValue: "",
      keywords: "",
      name: ""
    };

    this.lastAddressSearched = "";

    this.payorSelectChanged = this.payorSelectChanged.bind(this);
    this.specialtySelectChanged = this.specialtySelectChanged.bind(this);
    this.credentialsSelectChanged = this.credentialsSelectChanged.bind(this);
    this.degreesSelectChanged = this.degreesSelectChanged.bind(this);
    this.addressChanged = this.addressChanged.bind(this);
    this.addressInputKeyUp = this.addressInputKeyUp.bind(this);
    this.addressInputChanged = this.addressInputChanged.bind(this);
    this.geocodeResponse = this.geocodeResponse.bind(this);
    this.radiusSliderChange = this.radiusSliderChange.bind(this);
    this.radiusSliderReleased = this.radiusSliderReleased.bind(this);
    this.practiceAgeSliderChange = this.practiceAgeSliderChange.bind(this);
    this.practiceAgeSliderReleased = this.practiceAgeSliderReleased.bind(this);
    this.genderSelectChanged = this.genderSelectChanged.bind(this);
    this.contactInfoChanged = this.contactInfoChanged.bind(this);
    this.freeConsultChanged = this.freeConsultChanged.bind(this);
    this.languageSelectChanged = this.languageSelectChanged.bind(this);
    this.feeRangeSliderChange = this.feeRangeSliderChange.bind(this);
    this.feeRangeSliderReleased = this.feeRangeSliderReleased.bind(this);
    this.modalitySelectChanged = this.modalitySelectChanged.bind(this);
    this.planSelectChanged = this.planSelectChanged.bind(this);
    this.websiteChanged = this.websiteChanged.bind(this);
    this.nameChanged = this.nameChanged.bind(this);

    this.keywordInputKeyUp = this.generateKeyUpHandler("keywords");
    this.keywordInputChanged = this.generateInputChanged("keywords");
    this.nameInputKeyUp = this.generateKeyUpHandler("name");
    this.nameInputChanged = this.generateInputChanged("name");

    this.filterStateHasChanged = this.filterStateHasChanged.bind(this);
  }

  filterStateHasChanged() {
    const newFilterState = {
      payor: this.state.payor,
      plan: this.state.plan,
      specialties: this.state.specialties,
      degrees: this.state.degrees,
      credentials: this.state.credentials,
      radius: this.state.radius,
      practiceAge: this.state.practiceAge,
      gender: this.state.gender,
      contact: this.state.contact,
      language: this.state.language,
      modality: this.state.modality,
      freeConsult: this.state.freeConsult,
      keywords: this.state.keywords,
      website: this.state.website,
      name: this.state.name
    };

    let [min, max] = this.state.feeRange;
    if (min !== 0 || max !== 500) {
      newFilterState.feeRange = `${min},${max}`;
    }

    if (this.state.coordinates) {
      newFilterState.lat = this.state.coordinates.lat;
      newFilterState.lng = this.state.coordinates.lng;
    }

    this.props.onFiltersChanged(newFilterState);
  }

  payorSelectChanged(idx) {
    this.setState({ payor: idx }, this.filterStateHasChanged);
  }

  specialtySelectChanged(values) {
    this.setState({ specialties: values }, this.filterStateHasChanged);
  }

  credentialsSelectChanged(credentials) {
    this.setState({ credentials }, this.filterStateHasChanged);
  }

  degreesSelectChanged(degrees) {
    this.setState({ degrees }, this.filterStateHasChanged);
  }

  modalitySelectChanged(value) {
    this.setState({ modality: value }, this.filterStateHasChanged);
  }
  radiusSliderChange(value) {
    this.setState({ radius: value });
  }

  radiusSliderReleased(value) {
    this.setState({ radius: value }, this.filterStateHasChanged);
  }

  practiceAgeSliderChange(value) {
    this.setState({ practiceAge: value });
  }

  practiceAgeSliderReleased(value) {
    this.setState({ practiceAge: value }, this.filterStateHasChanged);
  }

  feeRangeSliderChange(value) {
    this.setState({ feeRange: value });
  }

  feeRangeSliderReleased(value) {
    this.setState({ feeRange: value }, this.filterStateHasChanged);
  }

  nameChanged(value) {
    this.setState({ name: value }, this.filterStateHasChanged);
  }

  addressChanged(newVal) {
    if (!this.props.maps) {
      TopToaster.show({
        message: "Google Maps API not loaded.",
        intent: Intent.DANGER,
        iconName: "error",
        timeout: 3500
      });
      return;
    }

    if (newVal === this.lastAddressSearched) {
      return;
    }

    if (!newVal) {
      this.setState(
        { coordinates: null, addressInputValidity: null },
        this.filterStateHasChanged
      );
      return;
    }

    this.setState({ processingAddress: true });
    this.lastAddressSearched = newVal;
    geocode(newVal)
      .then(this.geocodeResponse)
      .catch(() => {
        this.setState(
          { coordinates: null, addressInputValidity: "danger" },
          this.filterStateHasChanged
        );
      })
      .finally(() => {
        this.setState({ processingAddress: false });
      });
  }

  geocodeResponse(result) {
    this.setState(
      {
        addressInputValue: result.formatted_address,
        addressInputValidity: "success",
        coordinates: {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng()
        }
      },
      this.filterStateHasChanged
    );
  }

  genderSelectChanged(evt) {
    this.setState({ gender: evt.target.value }, this.filterStateHasChanged);
  }

  languageSelectChanged(idx) {
    this.setState({ language: idx }, this.filterStateHasChanged);
  }

  planSelectChanged(idx) {
    this.setState({ plan: idx }, this.filterStateHasChanged);
  }

  contactInfoChanged(evt) {
    this.setState({ contact: evt.target.checked }, () =>
      this.filterStateHasChanged()
    );
  }

  freeConsultChanged(evt) {
    this.setState(
      { freeConsult: evt.target.checked },
      this.filterStateHasChanged
    );
  }

  websiteChanged(evt) {
    this.setState({ website: evt.target.checked }, this.filterStateHasChanged);
  }

  addressInputChanged(evt) {
    this.setState({ addressInputValue: evt.target.value });
  }

  addressInputKeyUp(evt) {
    if (evt.keyCode === 13) {
      this.addressChanged(evt.target.value.trim());
    }
  }

  generateInputChanged(propertyName) {
    return evt => this.setState({ [propertyName]: evt.target.value });
  }

  static keywordReducer(acc, elt) {
    const e = elt.trim();
    return e ? acc + " " + e : acc;
  }

  generateKeyUpHandler(propertyName) {
    return evt => {
      if (evt.keyCode !== 13) {
        return false;
      }

      const val = evt.target.value
        .replace(/[|&;$%@:*,./'"<>()+]/g, "")
        .split(" ")
        .reduce(FilterEditor.keywordReducer);

      this.setState({ [propertyName]: val }, this.filterStateHasChanged);
    };
  }

  render() {
    let addressButton;

    if (this.state.processingAddress) {
      addressButton = <Spinner className="pt-small" intent={Intent.PRIMARY} />;
    } else {
      addressButton = (
        <button
          className="pt-button pt-minimal pt-icon-arrow-right"
          onClick={this.addressChanged}
        />
      );
    }

    return (
      <div className={"filter-editor"}>
        <h3>Search Filters</h3>

        <div
          className={
            "pt-input-group address-search " +
            (this.state.addressInputValidity
              ? "pt-intent-" + this.state.addressInputValidity
              : "")
          }
        >
          <span className="pt-icon pt-icon-search" />
          <input
            type="text"
            disabled={this.state.processingAddress}
            className="pt-input"
            placeholder="Address"
            onKeyUp={this.addressInputKeyUp}
            onChange={this.addressInputChanged}
            value={this.state.addressInputValue}
          />
          {addressButton}
        </div>

        <label className={"pt-label"}>
          Radius (Miles)
          <div className={"slider-container"}>
            <Slider
              min={0.5}
              max={10}
              stepSize={0.5}
              labelStepSize={3}
              value={this.state.radius}
              onChange={this.radiusSliderChange}
              onRelease={this.radiusSliderReleased}
              disabled={this.state.addressInputValidity !== "success"}
            />
          </div>
        </label>

        <label className={"pt-label"}>
          Practice Age
          <div className={"slider-container"}>
            <Slider
              min={0}
              max={50}
              stepSize={1}
              labelStepSize={10}
              value={this.state.practiceAge}
              onChange={this.practiceAgeSliderChange}
              onRelease={this.practiceAgeSliderReleased}
            />
          </div>
        </label>

        <label className={"pt-label"}>
          Fee Range
          <div className={"slider-container"}>
            <RangeSlider
              min={0}
              max={500}
              stepSize={10}
              labelStepSize={150}
              value={this.state.feeRange}
              onChange={this.feeRangeSliderChange}
              onRelease={this.feeRangeSliderReleased}
            />
          </div>
        </label>

        <label className={"pt-label"}>
          Name
          <div className={"pt-input-group"}>
            <span className="pt-icon pt-icon-search" />
            <input
              type="text"
              className="pt-input"
              placeholder="Enter Keywords"
              onKeyUp={this.nameInputKeyUp}
              onChange={this.nameInputChanged}
              value={this.state.name}
            />
          </div>
        </label>

        <FixtureSelect
          displayName={"Payor"}
          propertyName={"payors"}
          callback={this.payorSelectChanged}
        />

        <PayorSelect
          payor={this.state.payor}
          callback={this.planSelectChanged}
        />

        <FixtureMultiSelect
          displayName={"Specialties"}
          propertyName={"specialties"}
          callback={this.specialtySelectChanged}
        />

        <FixtureMultiSelect
          displayName={"Credential"}
          propertyName={"credentials"}
          callback={this.credentialsSelectChanged}
        />

        <FixtureMultiSelect
          displayName={"Degree"}
          propertyName={"degrees"}
          callback={this.degreesSelectChanged}
        />

        <FixtureSelect
          displayName={"Modality"}
          propertyName={"modalities"}
          callback={this.modalitySelectChanged}
        />

        <label className="pt-label">
          Gender
          <div className="pt-select">
            <select
              defaultValue={this.state.gender}
              onChange={this.genderSelectChanged}
            >
              {GENDER_OPTIONS}
            </select>
          </div>
        </label>

        <FixtureSelect
          displayName={"Language"}
          propertyName={"languages"}
          callback={this.languageSelectChanged}
        />

        <label className={"pt-label"}>
          Group / Orientation
          <div className={"pt-input-group"}>
            <span className="pt-icon pt-icon-search" />
            <input
              type="text"
              className="pt-input"
              placeholder="Enter Keywords"
              onKeyUp={this.keywordInputKeyUp}
              onChange={this.keywordInputChanged}
              value={this.state.keywords}
            />
          </div>
        </label>

        <CheckBox
          defaultValue={this.state.contact}
          onChange={this.contactInfoChanged}
          text={"Has Contact Info"}
        />

        <CheckBox
          defaultValue={this.state.freeConsult}
          onChange={this.freeConsultChanged}
          text={"Free Consult"}
        />

        <CheckBox
          defaultValue={this.state.website}
          onChange={this.websiteChanged}
          text={"Has Website"}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    fixtures: state.fixtures,
    maps: state.maps
  };
};

export default connect(mapStateToProps)(FilterEditor);
