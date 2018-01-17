import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import reducers from "../state/api";

export default combineReducers({
  ...reducers,
  routing: routerReducer
});
