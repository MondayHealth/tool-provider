import React, { Component } from "react";
import PropTypes from "prop-types";
import { Classes, NumericInput } from "@blueprintjs/core";

class PaginationEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.initialCount || 100,
      page: 1,
      pageCount: 1
    };

    this.countChanged = this.countChanged.bind(this);
    this.pageChanged = this.pageChanged.bind(this);

    this.options = [50, 100, 500].map(value => (
      <option key={value} value={value}>
        {value}
      </option>
    ));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.total !== nextProps.total) {
      let npc = Math.ceil(nextProps.total / this.state.count);
      this.setState({ pageCount: npc });
    }
  }

  recalculateOffset(page, count) {
    const offset = count * (page - 1);

    if (offset < 0 || offset > this.props.total) {
      return;
    }

    this.props.onOffsetChanged(offset, count);
  }

  pageChanged(newVal) {
    this.setState({ page: newVal });
    this.recalculateOffset(newVal, this.state.count);
  }

  countChanged(event) {
    const newVal = parseInt(event.target.value, 10) || 0;

    if (!newVal) {
      return;
    }

    const newPages = Math.ceil(this.props.total / newVal);
    this.setState({ count: newVal, pageCount: newPages });
    this.recalculateOffset(this.state.page, newVal);
  }

  render() {
    let paginator = null;

    if (this.state.pageCount > 1) {
      paginator = (
        <NumericInput
          className={Classes.FILL}
          value={this.state.page}
          min={1}
          max={this.state.pageCount}
          onValueChange={this.pageChanged}
          placeholder="Page"
        />
      );
    } else {
      paginator = <NumericInput value={1} disabled={true} />;
    }

    return (
      <div className="pagination-editor">
        <div className="pt-form-group pt-inline">
          <label className="pt-label">Page</label>
          {paginator}
        </div>
        <span>of {this.state.pageCount} pages.</span>
        <div className="pt-select">
          <select defaultValue={this.state.count} onChange={this.countChanged}>
            {this.options}
          </select>
        </div>
        <span>results per page. {this.props.total} total results.</span>
      </div>
    );
  }
}

PaginationEditor.propTypes = {
  total: PropTypes.number.isRequired,
  count: PropTypes.number,
  page: PropTypes.number,
  initialCount: PropTypes.number,
  onOffsetChanged: PropTypes.func.isRequired
};

export default PaginationEditor;
