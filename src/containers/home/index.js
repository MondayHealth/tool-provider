import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";

const Home = props => (
  <div>
    <h1>Home!</h1>
    <p>Welcome to the Home Page.</p>
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
