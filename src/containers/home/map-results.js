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
    this.map = new Map(node, null);
    this.map.setMouseOverFunction(this.props.mouseOverHandler);
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
      let id = elements[j].id;
      let count = addresses.length;
      for (let i = 0; i < count; i++) {
        let current = addresses[i];
        newPins.push({
          id: id,
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

    if (this.map && this.props.center) {
      this.map.center(this.props.center);
      this.map.circle(this.props.radius);
      this.map.fitToCircle();
    }

    if (!prevProps || this.props.elements !== prevProps.elements) {
      this.updatePins();
    }
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    return (
      <div className={"results-map-wrapper"}>
        <div ref="map" className={"results-map"} />
      </div>
    );
  }
}

MapResults.propTypes = {
  loading: PropTypes.bool,
  center: PropTypes.instanceOf(Object),
  locations: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  mouseOverHandler: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    maps: state.maps
  };
};

export default connect(mapStateToProps)(MapResults);
