import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Spinner } from "@blueprintjs/core";
import PropTypes from "prop-types";
import Map from "../../util/gmaps";
import { loadDetailByID, mouseOverProviderByID } from "../../state/api/actions";

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
    this.map.setClickHandlerFunction(this.mapPinClicked.bind(this));
  }

  mapPinClicked(ids) {
    if (ids) {
      this.props.setDetailID(ids.values().next().value);
    }
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

    if (this.map) {
      if (this.props.center) {
        this.map.center(this.props.center);
        this.map.circle(this.props.radius);
      }
      const currentID = this.props.mouseOverID.id;
      if (!prevProps || currentID !== prevProps.mouseOverID.id) {
        this.map.bouncePinsForID(currentID);
      }
      const detailID = this.props.detail.id;
      if (detailID !== prevProps.detail.id) {
        this.map.highlightPinsForID(detailID);
      }
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
    maps: state.maps,
    mouseOverID: state.mouseOverProviderID,
    detail: state.detail
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setDetailID: loadDetailByID(dispatch),
    mouseOverProvider: mouseOverProviderByID(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapResults);
