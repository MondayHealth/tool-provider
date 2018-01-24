import {
  GOOGLE_MAPS_LOADED,
  RECEIVE_CREDENTIALS_FIXTURE,
  RECEIVE_HELLO,
  RECEIVE_PAYORS_FIXTURE,
  RECEIVE_PROVIDER_RECORD_COUNT,
  RECEIVE_PROVIDER_RECORD_LIST,
  RECEIVE_SPECIALTIES_FIXTURE
} from "./actions";

// noinspection JSUnusedGlobalSymbols
export function maps(state = null, action) {
  switch (action.type) {
    case GOOGLE_MAPS_LOADED:
      return window["google"]["maps"];
    default:
      return state;
  }
}

const initialUserState = {
  name: "",
  email: ""
};

// noinspection JSUnusedGlobalSymbols
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
    let current = data[i];
    if (current) {
      ret[current.id] = current;
    }
  }
  return ret;
}

// noinspection JSUnusedGlobalSymbols
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
  credentials: {},
  specialties: {}
};

function generatePayorArray(data) {
  const ret = [];
  Object.entries(data).forEach(
    ([key, value]) => (ret[parseInt(key, 10)] = value)
  );
  return ret;
}

function generateIntKeyDictionary(data) {
  const ret = {};
  Object.entries(data).forEach(
    ([key, value]) => (ret[parseInt(key, 10)] = value)
  );
  return ret;
}

// noinspection JSUnusedGlobalSymbols
export function fixtures(state = initialFixturesState, action) {
  switch (action.type) {
    case RECEIVE_PAYORS_FIXTURE:
      return { ...state, payors: generatePayorArray(action.result) };
    case RECEIVE_CREDENTIALS_FIXTURE:
      return {
        ...state,
        credentials: generateIntKeyDictionary(action.result)
      };
    case RECEIVE_SPECIALTIES_FIXTURE:
      return {
        ...state,
        specialties: generateIntKeyDictionary(action.result)
      };
    default:
      return state;
  }
}
