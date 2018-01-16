import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";

const Home = props => (
  <div>
    <p>This should list providers.</p>
  </div>
);

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changePage: () => push("/about")
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(Home);
