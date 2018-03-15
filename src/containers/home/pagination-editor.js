import React, { Component } from "react";
import PropTypes from "prop-types";
import { Classes, NumericInput } from "@blueprintjs/core";
import { connect } from "react-redux";
import { providerCount } from "../../state/api/actions";

import "./pagination-editor.css";

class PaginationEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 15,
      page: 1,
      pageCount: 1,
      providerTotal: 0
    };

    this.countChanged = this.countChanged.bind(this);
    this.pageChanged = this.pageChanged.bind(this);

    this.options = [15, 25].map(value => (
      <option key={value} value={value}>
        {value}
      </option>
    ));

    this.offset = 0;
  }

  componentWillMount() {
    this.props.loadProviderCount();
  }

  componentWillReceiveProps(nextProps) {
    const total = nextProps.provider.total;
    if (this.props.provider.total !== total) {
      let npc = Math.ceil(total / this.state.count);
      this.setState({ pageCount: npc });
    }

    if (this.state.providerTotal !== nextProps.provider.serverCount) {
      this.setState({ providerTotal: nextProps.provider.serverCount });
    }
  }

  recheckOffset() {
    const count = this.state.count;
    const offset = count * (this.state.page - 1);
    if (this.offset === offset) {
      return;
    }

    if (offset < 0 && offset > this.state.providerTotal) {
      return;
    }

    this.offset = offset;
    this.props.onOffsetChanged(offset, count);
  }

  pageChanged(newVal) {
    if (newVal < 1 || isNaN(newVal) || newVal > this.state.pageCount) {
      return;
    }

    this.setState({ page: newVal }, this.recheckOffset.bind(this));
  }

  countChanged(event) {
    const newVal = parseInt(event.target.value, 10) || 0;

    if (!newVal) {
      return;
    }

    const newPages = Math.ceil(this.props.provider.total / newVal);
    this.setState(
      { count: newVal, pageCount: newPages },
      this.recheckOffset.bind(this)
    );
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
      paginator = (
        <NumericInput
          className={Classes.FILL}
          value={1}
          max={1}
          disabled={true}
        />
      );
    }

    return (
      <div className="pagination-editor">
        <div className="pt-form-group pt-inline">{paginator}</div>
        <div className="pt-select">
          <select defaultValue={this.state.count} onChange={this.countChanged}>
            {this.options}
          </select>
        </div>
        <span>
          {this.state.pageCount} pages for {this.props.provider.total} results.
        </span>
      </div>
    );
  }
}

PaginationEditor.propTypes = {
  count: PropTypes.number,
  page: PropTypes.number,
  onOffsetChanged: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    provider: state.providers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadProviderCount: providerCount(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaginationEditor);
