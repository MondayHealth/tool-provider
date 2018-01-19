import React, { Component } from "react";
import { connect } from "react-redux";
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

  render() {
    return (
      <div>
        <PaginationEditor
          total={this.props.provider.serverCount}
          initialCount={this.providerOffset.count}
          onOffsetChanged={this.offsetChanged}
        />

        <ProviderResultList elements={this.props.provider.byID} />
      </div>
    );
  }
}

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
