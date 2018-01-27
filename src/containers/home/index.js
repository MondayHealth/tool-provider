import React, { Component } from "react";
import { connect } from "react-redux";
import { providerCount, providerList } from "../../state/api/actions";

import ProviderResultList from "./provider-result-list";
import PaginationEditor from "./pagination-editor";
import FilterEditor from "./filter-editor";
import MapResults from "./map-results";

function shallowEquals(a, b) {
  let keys = Object.keys(a);
  for (let key in keys) {
    if (!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }

  keys = Object.keys(b);
  for (let key in keys) {
    if (!(key in a) || a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: null
    };

    this.providerOffset = {
      offset: 0,
      count: 100
    };

    this.filters = {
      payor: 0,
      specialty: 0,
      coordinates: null
    };

    this.initialCount = 50;

    this.offsetChanged = this.offsetChanged.bind(this);
    this.filtersChanged = this.filtersChanged.bind(this);

    this.currentParams = {};
  }

  componentWillMount() {
    this.props.loadProviderCount();
    this.reload();
  }

  reload() {
    const params = Object.assign({}, this.providerOffset, this.filters);

    // This is how we indicate that we don't wanna filter by payor
    if (params.payor < 1) {
      delete params.payor;
    }

    if (params.specialty < 1) {
      delete params.specialty;
    }

    // Don't do anything if the params haven't changed
    if (shallowEquals(params, this.currentParams)) {
      return;
    }

    this.currentParams = params;

    const newCenter =
      "lat" in params ? { lat: params.lat, lng: params.lng } : null;
    this.setState({ center: newCenter });
    this.props.requery(this.currentParams);
  }

  offsetChanged(offset, count) {
    this.providerOffset.offset = offset;
    this.providerOffset.count = count;
    this.reload();
  }

  filtersChanged(newFilters) {
    this.filters = newFilters;
    this.reload();
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
          <MapResults center={this.state.center} />
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
    requery: providerList(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
