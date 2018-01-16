import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import "@blueprintjs/core/dist/blueprint.css";
import "./index.css";
import App from "./containers/app";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
