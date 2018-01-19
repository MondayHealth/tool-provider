import React, { Component } from "react";

const I_CLASSES = "pt-input pt-fill";

class FilterEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      zip: null,
      insurance: null,
      specialty: null,
      contact: false
    };
  }

  render() {
    return (
      <div className={"filter-editor"}>
        <h3>Search Filters</h3>
        <label>
          Zip Code
          <input className={I_CLASSES} type="text" value={this.state.zip} />
        </label>

        <lable>
          Insurance
          <input
            className={I_CLASSES}
            type="text"
            value={this.state.insurance}
          />
        </lable>

        <label>
          Specialty
          <input className={I_CLASSES} type="text" value={this.state.zip} />
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

export default FilterEditor;
