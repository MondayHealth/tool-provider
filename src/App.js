import React, { Component } from "react";
import { Button } from "@blueprintjs/core";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav>
            <li>Provider DB</li>
          </nav>
        </header>
        <Button>Hello!</Button>
        <p className="App-intro">Hello, world.</p>
      </div>
    );
  }
}

export default App;
