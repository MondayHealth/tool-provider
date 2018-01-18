import React, { Component } from "react";
import PropTypes from "prop-types";

class PaginationEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: props.offset || 0,
      count: props.count || 100
    };

    this.offsetChanged = this.offsetChanged.bind(this);
    this.countChanged = this.countChanged.bind(this);
  }

  offsetChanged(event) {
    const newVal = parseInt(event.target.value, 10) || 0;

    this.setState({ offset: newVal });
    this.props.onOffsetChanged(newVal);
  }

  countChanged(event) {
    const newVal = parseInt(event.target.value, 10) || 0;

    if (!newVal) {
      return;
    }

    this.setState({ count: newVal });
    this.props.onCountChanged(newVal);
  }

  render() {
    return (
      <div className="pagination-editor">
        <label>
          Offset
          <input value={this.state.offset} onChange={this.offsetChanged} />
        </label>
        <label>
          Count
          <input value={this.state.count} onChange={this.countChanged} />
        </label>
        <span>count: {this.props.total}</span>
      </div>
    );
  }
}

PaginationEditor.propTypes = {
  total: PropTypes.number.isRequired,
  offset: PropTypes.number,
  count: PropTypes.number,
  onCountChanged: PropTypes.func.isRequired,
  onOffsetChanged: PropTypes.func.isRequired
};

export default PaginationEditor;
