import React, { Component } from "react";
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
        <p className="App-intro">Hello, world.</p>
      </div>
    );
  }
}

export default App;
