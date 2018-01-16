import React from "react";
import { render } from "react-dom";
import "normalize.css";
import "@blueprintjs/core/dist/blueprint.css";
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
