import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Spinner } from "@blueprintjs/core";
import PropTypes from "prop-types";
import Map from "../../util/gmaps";

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
    this.map.circle(this.props.radius);
    this.map.fitToCircle();
  }

  updatePins() {
    if (!this.map) {
      return;
    }

    const newPins = [];
    const elements = Object.values(this.props.elements);
    const elementCount = elements.length;
    for (let j = 0; j < elementCount; j++) {
      let addresses = elements[j].addresses;
      let count = addresses.length;
      for (let i = 0; i < count; i++) {
        let current = addresses[i];
        newPins.push({
          title: current.formatted,
          lng: current.lng,
          lat: current.lat
        });
      }
    }

    this.map.updatePins(newPins);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.maps && this.props.maps) {
      this.setState({ loading: false }, () => this.loadMap());
    }

    if (this.map) {
      this.map.center(this.props.center);
      this.map.circle(this.props.radius);
      this.map.fitToCircle();

      if (!prevProps || this.props.elements !== prevProps.elements) {
        this.updatePins();
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
