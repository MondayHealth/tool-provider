import React, { Component } from "react";
import { connect } from "react-redux";
import { TopToaster } from "../../toaster";
import { Intent, Spinner } from "@blueprintjs/core";

class FilterEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payor: "0",
      specialty: "0",
      processingAddress: false,
      addressInputValue: ""
    };

    this.lastAddressSearched = "";

    this.payorOptions = [];
    this.specialtyOptions = [];
    this.regeneratePayorOptions(this.props);
    this.regenerateSpecialtyOptions(this.props);

    this.insuranceSelectChanged = this.insuranceSelectChanged.bind(this);
    this.specialtySelectChanged = this.specialtySelectChanged.bind(this);
    this.addressChanged = this.addressChanged.bind(this);
    this.addressInputKeyup = this.addressInputKeyup.bind(this);
    this.addressInputChanged = this.addressInputChanged.bind(this);
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
      specialty: this.state.specialty
    };

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

  addressChanged(elt) {
    if (!this.props.maps) {
      TopToaster.show({
        message: "Google Maps API not loaded.",
        intent: Intent.DANGER,
        iconName: "error",
        timeout: 3500
      });
      return;
    }

    const newVal = elt.target.value.trim();

    if (newVal === this.lastAddressSearched) {
      return;
    }

    if (!newVal) {
      // @TODO: Clear the address search state
      console.log("Address cleared.");
      return;
    }

    console.log("New address:", newVal);

    this.setState({ processingAddress: true });
    this.lastAddressSearched = newVal;
    // @TODO: REQUEST
  }

  geocodeResponse(results, status) {
    this.setState({ processingAddress: false });
    console.log(status);
    console.log(results);

    if (results.length < 1) {
      TopToaster.show({
        message: "No address for search " + this.state.addressInputValue,
        intent: Intent.WARNING,
        iconName: "error",
        timeout: 3500
      });
      return;
    }

    if (results.length > 1) {
      TopToaster.show({
        message: "Multiple addresses for " + this.state.addressInputValue,
        intent: Intent.WARNING,
        iconName: "error",
        timeout: 3500
      });
    }

    const result = results[0];

    this.setState({ addressInputValue: result.formatted_address });
  }

  addressInputChanged(evt) {
    this.setState({ addressInputValue: evt.target.value });
  }

  addressInputKeyup(evt) {
    if (evt.keyCode === 13) {
      this.addressChanged({ target: evt.target });
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
        <div className="pt-input-group address-search">
          <span className="pt-icon pt-icon-search" />
          <input
            type="text"
            disabled={this.state.processingAddress}
            className="pt-input"
            placeholder="Address"
            onKeyUp={this.addressInputKeyup}
            onChange={this.addressInputChanged}
            value={this.state.addressInputValue}
          />
          {addressButton}
        </div>

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
