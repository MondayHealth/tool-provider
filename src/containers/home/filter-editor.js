import React, { Component } from "react";
import { connect } from "react-redux";
import { TopToaster } from "../../toaster";
import {
  Button,
  Intent,
  MenuItem,
  RangeSlider,
  Slider,
  Spinner,
  Alignment
} from "@blueprintjs/core";
import { geocode } from "../../util/gmaps";

import { MultiSelect, Select } from "@blueprintjs/select";

class FixtureSelectPre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectionName: null
    };

    this.cb = this.cb.bind(this);

    this.elementList = [];
  }

  componentWillReceiveProps(nextProps) {
    const pName = this.props.propertyName;
    const currentFixture = this.props.fixtures[pName];
    const nextFixture = nextProps.fixtures ? nextProps.fixtures[pName] : null;

    if (currentFixture === nextFixture) {
      return;
    }

    if (!nextFixture) {
      this.elementList = [];
      return;
    }

    if (Array.isArray(nextFixture)) {
      this.elementList = nextFixture.map((t, i) => [i, t]);
    } else {
      this.elementList = Object.entries(nextFixture);
    }
  }

  cb([key, value]) {
    this.setState({ selectionName: value });
    this.props.callback(key);
  }

  static valuePredicate(pred, [index, value]) {
    return !pred ? true : value.indexOf(pred.trim()) > -1;
  }

  static renderItem([idx, value], { handleClick, modifiers }) {
    if (modifiers.filtered) {
      return null;
    }

    if (!modifiers.matchesPredicate) {
      return null;
    }

    return (
      <MenuItem key={idx} label={idx} text={value} onClick={handleClick} />
    );
  }

  render() {
    const btnText = this.state.selectionName || this.props.displayName;

    return (
      <label className="pt-label fixture-select">
        {this.props.displayName}
        <Select
          items={this.elementList}
          onItemSelect={this.cb}
          noResults={<MenuItem key={0} disabled={true} text="No results." />}
          itemPredicate={FixtureSelectPre.valuePredicate}
          itemRenderer={FixtureSelectPre.renderItem}
          popoverProps={{ minimal: false }}
        >
          <Button
            text={btnText}
            rightIcon="caret-down"
            alignText={Alignment.LEFT}
          />
        </Select>
      </label>
    );
  }
}

const FixtureSelect = connect(state => {
  return {
    fixtures: state.fixtures
  };
})(FixtureSelectPre);

class FilterEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payor: 0,
      specialty: 0,
      gender: 0,
      language: 0,
      modality: 0,
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

    this.specialtyOptions = [];
    this.regenerateSpecialtyOptions(this.props);

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

    this.payorSelectChanged = this.payorSelectChanged.bind(this);
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

  regenerateSpecialtyOptions(props) {
    this.specialtyOptions = Object.entries(props.fixtures.specialties).map(
      a => a
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fixtures.specialties !== nextProps.fixtures.specialties) {
      this.regenerateSpecialtyOptions(nextProps);
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

  payorSelectChanged(idx) {
    this.setState({ payor: idx }, () => this.filterStateHasChanged());
  }

  specialtySelectChanged(elt) {
    this.setState({ specialty: elt.target.value }, () =>
      this.filterStateHasChanged()
    );
  }

  modalitySelectChanged(value) {
    this.setState({ modality: value }, () => this.filterStateHasChanged());
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

  languageSelectChanged(idx) {
    this.setState({ language: idx }, () => this.filterStateHasChanged());
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

        <FixtureSelect
          displayName={"Payor"}
          propertyName={"payors"}
          callback={this.payorSelectChanged}
        />

        <label className="pt-label">
          Specialty
          <MultiSelect
            itemRenderer={([idx, value], { handleClick, index, modifiers }) => {
              return (
                <MenuItem
                  key={idx}
                  label={idx}
                  text={value}
                  onClick={handleClick}
                />
              );
            }}
            items={this.specialtyOptions}
            noResults={<MenuItem key={0} disabled={true} text="No results." />}
            initialConent={<MenuItem disabled={true} text={`Languages`} />}
            onItemSelect={val => console.log(val)}
            tagRenderer={a => {
              debugger;
              return a;
            }}
          />
        </label>

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
              {this.genderOptions}
            </select>
          </div>
        </label>

        <FixtureSelect
          displayName={"Language"}
          propertyName={"languages"}
          callback={this.languageSelectChanged}
        />

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
