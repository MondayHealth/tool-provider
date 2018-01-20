import React, { Component } from "react";
import { connect } from "react-redux";

const I_CLASSES = "pt-input pt-fill";

class FilterEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payor: "0"
    };

    this.payorOptions = null;

    this.insuranceSelectChanged = this.insuranceSelectChanged.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fixtures.payors === nextProps.fixtures.payors) {
      return;
    }
    this.payorOptions = nextProps.fixtures.payors.map((value, index) => (
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

  filterStateHasChanged() {
    const newFilterState = {
      payor: this.state.payor
    };

    this.props.onFiltersChanged(newFilterState);
  }

  insuranceSelectChanged(elt) {
    this.setState({ payor: elt.target.value }, () =>
      this.filterStateHasChanged()
    );
  }

  render() {
    return (
      <div className={"filter-editor"}>
        <h3>Search Filters</h3>
        <label className={"pt-label"}>
          Address
          <input className={I_CLASSES} type="text" />
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

        <label className={"pt-label"}>
          Specialty
          <input className={I_CLASSES} type="text" />
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
    fixtures: state.fixtures
  };
};

export default connect(mapStateToProps)(FilterEditor);
