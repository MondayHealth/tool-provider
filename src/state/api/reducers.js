import { RECEIVE_HELLO } from "./actions";

const initialUserState = {
  name: "",
  email: ""
};

export function userState(state = initialUserState, action) {
  switch (action.type) {
    case RECEIVE_HELLO:
      return action.user;
    default:
      return state;
  }
}

