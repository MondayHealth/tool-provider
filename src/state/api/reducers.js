import {
  RECEIVE_HELLO,
  RECEIVE_PROVIDER_RECORD_COUNT,
  RECEIVE_PROVIDER_RECORD_LIST,
} from "./actions";

const initialUserState = {
  name: "",
  email: ""
};

export function userState(state = initialUserState, action) {
  switch (action.type) {
    case RECEIVE_HELLO:
      return action.result;
    default:
      return state;
  }
}

const initialProviderState = {
  serverCount: -1,
  byID: {}
};

function generateProviderIDDictionary(data) {
  const ret = {};
  const count = data.length;
  for (let i = 0; i < count; i++) {
    ret[data[i].id] = data[i];
  }
  return ret;
}

export function providers(state = initialProviderState, action) {
  switch (action.type) {
    case RECEIVE_PROVIDER_RECORD_COUNT:
      return { ...state, serverCount: action.result };
    case RECEIVE_PROVIDER_RECORD_LIST:
      return { ...state, byID: generateProviderIDDictionary(action.result) };
    default:
      return state;
  }
}
