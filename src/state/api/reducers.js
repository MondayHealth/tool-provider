import {
  RECEIVE_CREDENTIALS_FIXTURE,
  RECEIVE_HELLO,
  RECEIVE_PAYORS_FIXTURE,
  RECEIVE_PROVIDER_RECORD_COUNT,
  RECEIVE_PROVIDER_RECORD_LIST
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

const initialFixturesState = {
  payors: [],
  credentials: {}
};

function generatePayorArray(data) {
  const ret = [];
  Object.entries(data).forEach(
    ([key, value]) => (ret[parseInt(key, 10)] = value)
  );
  return ret;
}

function generateCredentialsDictionary(data) {
  const ret = {};
  Object.entries(data).forEach(([key, value]) => (ret[key] = value));
  return ret;
}

export function fixtures(state = initialFixturesState, action) {
  switch (action.type) {
    case RECEIVE_PAYORS_FIXTURE:
      return { ...state, payors: generatePayorArray(action.result) };
    case RECEIVE_CREDENTIALS_FIXTURE:
      return {
        ...state,
        credentials: generateCredentialsDictionary(action.result)
      };
    default:
      return state;
  }
}
