import React, { Component } from "react";
import { connect } from "react-redux";
import { providerCount, providerList } from "../../state/api/actions";

import ProviderResultList from "./provider-result-list";
import PaginationEditor from "./pagination-editor";
import FilterEditor from "./filter-editor";

class Home extends Component {
  constructor(props) {
    super(props);
    this.providerOffset = {
      offset: 0,
      count: 100
    };
    this.filters = {
      payor: 0
    };
    this.initialCount = 50;

    this.offsetChanged = this.offsetChanged.bind(this);
    this.filtersChanged = this.filtersChanged.bind(this);
  }

  componentWillMount() {
    this.props.loadProviderCount();
    this.reloadProviderOffset();
  }

  reloadProviderOffset() {
    this.props.loadProviderOffset(this.providerOffset);
  }

  offsetChanged(offset, count) {
    let delta = false;
    if (this.providerOffset.offset !== offset) {
      this.providerOffset.offset = offset;
      delta = true;
    }
    if (this.providerOffset.count !== count) {
      this.providerOffset.count = count;
      delta = true;
    }

    if (delta) {
      this.reloadProviderOffset();
    }
  }

  filtersChanged(newFilters) {
    console.log(newFilters);
  }

  render() {
    return (
      <div>
        <div className="home-content-container">
          <FilterEditor onFiltersChanged={this.filtersChanged} />
          <div className="home-results-container">
            <PaginationEditor
              total={this.props.provider.serverCount}
              initialCount={this.initialCount}
              onOffsetChanged={this.offsetChanged}
            />
            <ProviderResultList elements={this.props.provider.byID} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    provider: state.providers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadProviderCount: providerCount(dispatch),
    loadProviderOffset: providerList(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
