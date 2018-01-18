import React, { Component } from "react";
import PropTypes from "prop-types";

class PaginationEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.count,
      page: 0,
      pages: Math.ceil(props.total / props.count)
    };

    this.countChanged = this.countChanged.bind(this);
    this.pageChanged = this.pageChanged.bind(this);

    this.options = [50, 100, 500].map(value => (
      <option key={value} value={value}>
        {value}
      </option>
    ));
  }

  recalculateOffset() {
    const offset = this.state.count * this.state.page;
    this.props.onOffsetChanged(offset);
  }

  pageChanged(event) {
    const newVal = parseInt(event.target.value, 10) || 0;

    if (newVal < 0 || newVal > this.pages) {
      return;
    }

    this.setState({ page: newVal });
    this.recalculateOffset();
  }

  countChanged(event) {
    const newVal = parseInt(event.target.value, 10) || 0;

    if (!newVal) {
      return;
    }

    const newPages = Math.ceil(this.props.total / newVal);
    this.setState({ count: newVal, pages: newPages });
    this.props.onCountChanged(newVal);
    this.recalculateOffset();
  }

  render() {
    return (
      <div className="pagination-editor">
        <label className="pt-label" id="offset">
          Page
          <input
            className="pt-input"
            value={this.state.page}
            onChange={this.pageChanged}
          />
        </label>
        <span>of {this.state.pages} pages</span>
        <label className="pt-label">
          Results Per Page
          <div className="pt-select">
            <select
              defaultValue={this.props.count}
              onChange={this.countChanged}
            >
              {this.options}
            </select>
          </div>
        </label>
        <span>of {this.props.total} total.</span>
      </div>
    );
  }
}

PaginationEditor.propTypes = {
  total: PropTypes.number.isRequired,
  count: PropTypes.number,
  onCountChanged: PropTypes.func.isRequired,
  onOffsetChanged: PropTypes.func.isRequired
};

export default PaginationEditor;
