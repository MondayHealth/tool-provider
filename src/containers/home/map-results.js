import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Spinner } from "@blueprintjs/core";
import PropTypes from "prop-types";
import { Coordinate, generateMap } from "../../util/gmaps";

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
    const map = generateMap(node, "new york");
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.maps && this.props.maps) {
      this.setState({ loading: false }, () => this.loadMap());
    }
  }

  render() {
    const spinner = this.state.loading ? <Spinner /> : null;

    return (
      <div className={"map-results-container"}>
        {spinner}
        <div ref="map" className={"results-map"} />
      </div>
    );
  }
}
MapResults.propTypes = {
  loading: PropTypes.bool,
  center: PropTypes.instanceOf(Coordinate),
  locations: PropTypes.arrayOf(PropTypes.instanceOf(Coordinate))
};

const mapStateToProps = state => {
  return {
    maps: state.maps
  };
};

export default connect(mapStateToProps)(MapResults);
