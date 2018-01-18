import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import "./App.css";
import About from "../about";
import Home from "../home";
import Header from "../header";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <aside>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </aside>
        <main>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
        </main>
      </div>
    );
  }
}

export default App;
