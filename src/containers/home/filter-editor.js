import React, { Component } from "react";
import { connect } from "react-redux";
import { TopToaster } from "../../toaster";
import { Intent, Slider, Spinner } from "@blueprintjs/core";
import { geocode } from "../../util/gmaps";

class FilterEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payor: "0",
      specialty: "0",
      processingAddress: false,
      addressInputValue: "",
      coordinate: null,
      addressInputValidity: null,
      radius: 0.5
    };

    this.lastAddressSearched = "";

    this.payorOptions = [];
    this.specialtyOptions = [];
    this.regeneratePayorOptions(this.props);
    this.regenerateSpecialtyOptions(this.props);

    this.insuranceSelectChanged = this.insuranceSelectChanged.bind(this);
    this.specialtySelectChanged = this.specialtySelectChanged.bind(this);
    this.addressChanged = this.addressChanged.bind(this);
    this.addressInputKeyUp = this.addressInputKeyUp.bind(this);
    this.addressInputChanged = this.addressInputChanged.bind(this);
    this.geocodeResponse = this.geocodeResponse.bind(this);
    this.radiusSliderChange = this.radiusSliderChange.bind(this);
    this.radiusSliderReleased = this.radiusSliderReleased.bind(this);
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
  }

  filterStateHasChanged() {
    const newFilterState = {
      payor: this.state.payor,
      specialty: this.state.specialty,
      radius: this.state.radius * 1609.34
    };

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

  radiusSliderChange(value) {
    this.setState({ radius: value });
  }

  radiusSliderReleased(value) {
    this.setState({ radius: value }, () => this.filterStateHasChanged());
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

  addressInputChanged(evt) {
    this.setState({ addressInputValue: evt.target.value });
  }

  addressInputKeyUp(evt) {
    if (evt.keyCode === 13) {
      this.addressChanged(evt.target.value.trim());
    }
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
              min={0.25}
              max={10}
              stepSize={0.25}
              labelStepSize={3}
              value={this.state.radius}
              onChange={this.radiusSliderChange}
              onRelease={this.radiusSliderReleased}
              disabled={this.state.addressInputValidity !== "success"}
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

        <label className="pt-control pt-checkbox pt-large">
          <input type="checkbox" />
          <span className="pt-control-indicator" />
          Has Contact Info
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
