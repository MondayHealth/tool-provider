import React from "react";
import { render } from "react-dom";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "./index.css";
import App from "./containers/app";
import store, { history } from "./store-index";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import registerServiceWorker from "./registerServiceWorker";

const target = document.getElementById("root");

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  target
);

registerServiceWorker();
