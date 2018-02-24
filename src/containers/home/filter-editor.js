import React, { Component } from "react";
import { connect } from "react-redux";
import { TopToaster } from "../../toaster";
import { Intent, RangeSlider, Slider, Spinner } from "@blueprintjs/core";
import { geocode } from "../../util/gmaps";

class FilterEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payor: "0",
      specialty: "0",
      gender: "0",
      language: "0",
      modality: "0",
      feeRange: [0, 500],
      processingAddress: false,
      addressInputValue: "",
      coordinate: null,
      addressInputValidity: null,
      radius: 1,
      contact: false,
      freeConsult: false,
      freeInputValue: "",
      keywords: ""
    };

    this.lastAddressSearched = "";

    this.payorOptions = [];
    this.specialtyOptions = [];
    this.languageOptions = [];
    this.modalityOptions = [];
    this.regenerateLanguageOptions(this.props);
    this.regeneratePayorOptions(this.props);
    this.regenerateSpecialtyOptions(this.props);
    this.regenerateModalityOptions(this.props);

    this.genderOptions = [
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

    this.insuranceSelectChanged = this.insuranceSelectChanged.bind(this);
    this.specialtySelectChanged = this.specialtySelectChanged.bind(this);
    this.addressChanged = this.addressChanged.bind(this);
    this.addressInputKeyUp = this.addressInputKeyUp.bind(this);
    this.addressInputChanged = this.addressInputChanged.bind(this);
    this.geocodeResponse = this.geocodeResponse.bind(this);
    this.radiusSliderChange = this.radiusSliderChange.bind(this);
    this.radiusSliderReleased = this.radiusSliderReleased.bind(this);
    this.genderSelectChanged = this.genderSelectChanged.bind(this);
    this.contactInfoChanged = this.contactInfoChanged.bind(this);
    this.freeConsultChanged = this.freeConsultChanged.bind(this);
    this.languageSelectChanged = this.languageSelectChanged.bind(this);
    this.feeRangeSliderChange = this.feeRangeSliderChange.bind(this);
    this.feeRangeSliderReleased = this.feeRangeSliderReleased.bind(this);
    this.modalitySelectChanged = this.modalitySelectChanged.bind(this);
    this.keywordInputChanged = this.keywordInputChanged.bind(this);
    this.keywordInputKeyUp = this.keywordInputKeyUp.bind(this);
  }

  regeneratePayorOptions(props) {
    this.payorOptions = props.fixtures.payors.map((value, index) => (
      <option key={index} value={index}>
        {value}
      </option>
    ));

    this.payorOptions.unshift(
      <option key={"0"} value="0">
        None
      </option>
    );
  }

  regenerateLanguageOptions(props) {
    if (props.fixtures.languages) {
      this.languageOptions = Object.entries(props.fixtures.languages).map(
        ([index, value]) => (
          <option key={index} value={index}>
            {value}
          </option>
        )
      );
    }

    this.languageOptions.unshift(
      <option key={"0"} value="0">
        None
      </option>
    );
  }

  regenerateModalityOptions(props) {
    if (props.fixtures.modalities) {
      this.modalityOptions = Object.entries(props.fixtures.modalities).map(
        ([index, value]) => (
          <option key={index} value={index}>
            {value}
          </option>
        )
      );
    }
    this.modalityOptions.unshift(
      <option key={"0"} value="0">
        None
      </option>
    );
  }
  regenerateSpecialtyOptions(props) {
    this.specialtyOptions = Object.entries(props.fixtures.specialties).map(
      ([index, value]) => (
        <option key={index} value={index}>
          {value}
        </option>
      )
    );
    this.specialtyOptions.unshift(
      <option key={"0"} value="0">
        None
      </option>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fixtures.payors !== nextProps.fixtures.payors) {
      this.regeneratePayorOptions(nextProps);
    }
    if (this.props.fixtures.specialties !== nextProps.fixtures.specialties) {
      this.regenerateSpecialtyOptions(nextProps);
    }
    if (this.props.fixtures.languages !== nextProps.fixtures.languages) {
      this.regenerateLanguageOptions(nextProps);
    }
    if (this.props.fixtures.modalities !== nextProps.fixtures.modalities) {
      this.regenerateModalityOptions(nextProps);
    }
  }

  filterStateHasChanged() {
    const newFilterState = {
      payor: this.state.payor,
      specialty: this.state.specialty,
      radius: this.state.radius,
      gender: this.state.gender,
      contact: !!this.state.contact,
      language: this.state.language,
      modality: this.state.modality,
      freeConsult: this.state.freeConsult,
      keywords: this.state.keywords
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

  insuranceSelectChanged(elt) {
    this.setState({ payor: elt.target.value }, () =>
      this.filterStateHasChanged()
    );
  }

  specialtySelectChanged(elt) {
    this.setState({ specialty: elt.target.value }, () =>
      this.filterStateHasChanged()
    );
  }

  modalitySelectChanged(elt) {
    this.setState({ modality: elt.target.value }, () =>
      this.filterStateHasChanged()
    );
  }
  radiusSliderChange(value) {
    this.setState({ radius: value });
  }

  radiusSliderReleased(value) {
    this.setState({ radius: value }, () => this.filterStateHasChanged());
  }

  feeRangeSliderChange(value) {
    this.setState({ feeRange: value });
  }

  feeRangeSliderReleased(value) {
    this.setState({ feeRange: value }, () => this.filterStateHasChanged());
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
      this.setState({ coordinates: null, addressInputValidity: null }, () =>
        this.filterStateHasChanged()
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
          () => this.filterStateHasChanged()
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
      () => this.filterStateHasChanged()
    );
  }

  genderSelectChanged(evt) {
    this.setState({ gender: evt.target.value }, () =>
      this.filterStateHasChanged()
    );
  }

  languageSelectChanged(evt) {
    this.setState({ language: evt.target.value }, () =>
      this.filterStateHasChanged()
    );
  }

  contactInfoChanged(evt) {
    this.setState({ contact: evt.target.checked }, () =>
      this.filterStateHasChanged()
    );
  }

  freeConsultChanged(evt) {
    this.setState({ freeConsult: evt.target.checked }, () =>
      this.filterStateHasChanged()
    );
  }

  addressInputChanged(evt) {
    this.setState({ addressInputValue: evt.target.value });
  }

  addressInputKeyUp(evt) {
    if (evt.keyCode === 13) {
      this.addressChanged(evt.target.value.trim());
    }
  }

  keywordInputChanged(evt) {
    this.setState({ keywords: evt.target.value });
  }

  static keywordReducer(acc, elt) {
    const e = elt.trim();
    return e ? acc + " " + e : acc;
  }

  keywordInputKeyUp(evt) {
    if (evt.keyCode !== 13) {
      return;
    }

    let val = evt.target.value
      .replace(/[|&;$%@:*,./'"<>()+]/g, "")
      .split(" ")
      .reduce(FilterEditor.keywordReducer);

    this.setState({ keywords: val }, () => this.filterStateHasChanged());
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

        <label className="pt-label">
          Payor
          <div className="pt-select">
            <select
              defaultValue={this.state.payor}
              onChange={this.insuranceSelectChanged}
            >
              {this.payorOptions}
            </select>
          </div>
        </label>

        <label className="pt-label">
          Specialty
          <div className="pt-select">
            <select
              defaultValue={this.state.specialty}
              onChange={this.specialtySelectChanged}
            >
              {this.specialtyOptions}
            </select>
          </div>
        </label>

        <label className="pt-label">
          Modality
          <div className="pt-select">
            <select
              defaultValue={this.state.modality}
              onChange={this.modalitySelectChanged}
            >
              {this.modalityOptions}
            </select>
          </div>
        </label>

        <label className="pt-label">
          Gender
          <div className="pt-select">
            <select
              defaultValue={this.state.gender}
              onChange={this.genderSelectChanged}
            >
              {this.genderOptions}
            </select>
          </div>
        </label>

        <label className="pt-label">
          Language
          <div className="pt-select">
            <select
              defaultValue={this.state.language}
              onChange={this.languageSelectChanged}
            >
              {this.languageOptions}
            </select>
          </div>
        </label>

        <label className="pt-control pt-checkbox pt-large">
          <input
            type="checkbox"
            defaultValue={this.state.contact}
            onChange={this.contactInfoChanged}
          />
          <span className="pt-control-indicator" />
          Has Contact Info
        </label>

        <label className="pt-control pt-checkbox pt-large">
          <input
            type="checkbox"
            defaultValue={this.state.freeConsult}
            onChange={this.freeConsultChanged}
          />
          <span className="pt-control-indicator" />
          Free Consult
        </label>
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
