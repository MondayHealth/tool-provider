import React, { Component } from "react";

class FilterEditor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"filter-editor"}>
        <h3>Search Filters</h3>
        <div className={"filter-element"}>This is a filter setting.</div>
        <div className={"filter-element"}>This is a filter setting.</div>
        <div className={"filter-element"}>This is a filter setting.</div>
        <div className={"filter-element"}>This is a filter setting.</div>
      </div>
    );
  }
}

export default FilterEditor;
