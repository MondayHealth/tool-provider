import { applyMiddleware, compose, createStore } from "redux";
import createHistory from "history/createBrowserHistory";
import thunk from "redux-thunk";
import { routerMiddleware } from "react-router-redux";
import rootReducer from "./modules";

export const history = createHistory();

const initialState = {};
const enhancers = [];

if (process.env.NODE_ENV === "development") {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

const middleware = applyMiddleware(thunk, routerMiddleware(history));
const composedEnhancers = compose(middleware, ...enhancers);

const store = createStore(rootReducer, initialState, composedEnhancers);

export default store;
