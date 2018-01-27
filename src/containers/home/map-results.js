import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Spinner } from "@blueprintjs/core";
import PropTypes from "prop-types";
import Map from "../../util/gmaps";

function coordsEqual(c1, c2) {
  return c1.lat === c2.lat && c1.lng === c2.lng;
}

class MapResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.map = null;
  }

  loadMap() {
    const node = ReactDOM.findDOMNode(this.refs.map);
    this.map = new Map(node);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.maps && this.props.maps) {
      this.setState({ loading: false }, () => this.loadMap());
    }

    if (this.map) {
      if (this.props.center) {
        this.map.center(this.props.center);
      }
      if (this.props.radius) {
        this.map.circle(this.props.radius);
      }
    }
  }

  render() {
    const spinner = this.state.loading ? <Spinner /> : null;

    return (
      <div className={"map-results-container"}>
        {spinner}
        <div className={"results-map-wrapper"}>
          <div ref="map" className={"results-map"} />
        </div>
      </div>
    );
  }
}

MapResults.propTypes = {
  loading: PropTypes.bool,
  center: PropTypes.instanceOf(Object),
  locations: PropTypes.arrayOf(PropTypes.instanceOf(Object))
};

const mapStateToProps = state => {
  return {
    maps: state.maps
  };
};

export default connect(mapStateToProps)(MapResults);
