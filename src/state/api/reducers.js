import { RECEIVE_HELLO } from "./actions";

const initialUserState = {
  name: "",
  email: ""
};

export function userState(state = initialUserState, action) {
  if (!action) {
    return state;
  }

  console.log("state", state, "action", action);
  switch (action.type) {
    case RECEIVE_HELLO:
      return action.user;
    default:
      return state;
  }
}
