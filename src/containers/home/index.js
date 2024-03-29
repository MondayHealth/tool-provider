import React, { Component } from "react";
import { connect } from "react-redux";
import { providerList } from "../../state/api/actions";

import ProviderResultList from "./provider-result-list";
import PaginationEditor from "./pagination-editor";
import FilterEditor from "./filter-editor";
import MapResults from "./map-results";
import { METERS_PER_MILE } from "../../util/gmaps";
import ProviderDetail from "../detail/provider-detail";

function shallowEquals(a, b) {
  for (let key in a) {
    // noinspection JSUnfilteredForInLoop
    if (!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }

  for (let key in b) {
    // noinspection JSUnfilteredForInLoop
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
      center: null,
      radius: 1,
      selectedID: null
    };

    this.providerOffset = {
      offset: 0,
      count: 25
    };

    this.filters = {
      payor: 0,
      plan: 0,
      specialties: [],
      degrees: [],
      credentials: [],
      coordinates: null,
      radius: 1,
      gender: 0,
      language: 0,
      modality: 0,
      practiceAge: 0,
      contact: false,
      freeConsult: false,
      keywords: null,
      website: false
    };

    this.offsetChanged = this.offsetChanged.bind(this);
    this.filtersChanged = this.filtersChanged.bind(this);
    this.mapMouseOver = this.mapMouseOver.bind(this);

    this.currentParams = {};
  }

  componentWillMount() {
    this.reload();
  }

  reload() {
    const params = Object.assign({}, this.providerOffset, this.filters);

    if (this.state.radius) {
      this.setState({ radius: params.radius });
      params.radius = this.state.radius * METERS_PER_MILE;
    }

    // This is how we indicate that we don't wanna filter by payor
    if (params.payor < 1) {
      delete params.payor;
    }

    const arrayParam = name => {
      if (params[name].length < 1) {
        delete params[name];
      } else {
        params[name] = params[name].join(",");
      }
    };

    arrayParam("specialties");
    arrayParam("degrees");
    arrayParam("credentials");

    if (params.gender < 1) {
      delete params.gender;
    }

    if (params.modality < 1) {
      delete params.modality;
    }

    if (params.language < 1) {
      delete params.language;
    }

    if (!params.contact) {
      delete params.contact;
    }

    if (!params.freeConsult) {
      delete params.freeConsult;
    }

    if (!params.keywords) {
      delete params.keywords;
    }

    if (!params.practiceAge) {
      delete params.practiceAge;
    }

    if (!params.website) {
      delete params.website;
    }

    if (!params.name) {
      delete params.name;
    }

    if (params.payor) {
      if (params.plan) {
        delete params.payor;
      } else {
        delete params.plan;
      }
    } else {
      delete params.plan;
    }

    console.log(params);

    // Don't do anything if the params haven't changed
    if (shallowEquals(params, this.currentParams)) {
      return;
    }

    if ("lat" in params) {
      this.setState({ center: { lat: params.lat, lng: params.lng } });
    }

    this.currentParams = params;
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

  mapMouseOver(id) {
    this.setState({ selectedID: id });
  }

  render() {
    return (
      <div className="home-content-container">
        <FilterEditor onFiltersChanged={this.filtersChanged} />
        <div className="home-results-container">
          <PaginationEditor onOffsetChanged={this.offsetChanged} />
          <ProviderResultList elements={this.props.provider.byID} />
        </div>

        <div className={"side-bar-container"}>
          <MapResults
            center={this.state.center}
            radius={this.state.radius}
            elements={this.props.provider.byID}
            mouseOverHandler={this.mapMouseOver}
          />
          <ProviderDetail />
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
    requery: providerList(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
