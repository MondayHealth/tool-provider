import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import "./App.css";

const APP_NAME = "Provider";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", email: "" };
  }

  async componentDidMount() {
    const res = await fetch("/api/1/hello");
    const result = await res.json();

    if (!result.success) {
      console.error("Failed to hello!", result);
    }

    this.setState(result.result);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2 id="app-name">{APP_NAME}</h2>
          <h4 id="name-display">{this.state.name}</h4>
        </header>
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
