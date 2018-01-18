import React, { Component } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import { providerCount, providerList } from "../../state/api/actions";

import ProviderResultList from "./provider-result-list";
import PaginationEditor from "./pagination-editor";

class Home extends Component {
  constructor(props) {
    super(props);
    this.providerOffset = {
      offset: 0,
      count: 100
    };
    this.offsetChanged = this.offsetChanged.bind(this);
    this.countChanged = this.countChanged.bind(this);
  }

  componentWillMount() {
    this.props.loadProviderCount();
    this.reloadProviderOffset();
  }

  reloadProviderOffset() {
    this.props.loadProviderOffset(this.providerOffset);
  }

  offsetChanged(newVal) {
    this.providerOffset.offset = newVal;
    this.reloadProviderOffset();
  }

  countChanged(newVal) {
    this.providerOffset.count = newVal;
    this.reloadProviderOffset();
  }

  render() {
    return (
      <div>
        <PaginationEditor
          total={this.props.provider.serverCount}
          offset={this.providerOffset.offset}
          count={this.providerOffset.count}
          onOffsetChanged={this.offsetChanged}
          onCountChanged={this.countChanged}
        />

        <ProviderResultList elements={this.props.provider.byID} />
      </div>
    );
  }
}

Home.propTypes = {
  offset: PropTypes.number
};

const mapStateToProps = state => {
  return {
    user: state.userState,
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
