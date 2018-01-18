function apiURL(subLocation) {
  return `/api/1/${subLocation}`;
}

export const REQUEST_ERROR = "REQUEST_ERROR";
function requestError(request) {
  return {
    type: REQUEST_ERROR,
    error: [request]
  };
}

export const REQUEST_HELLO = "tx:hello";
export const RECEIVE_HELLO = "rx:hello";
export const REQUEST_PROVIDER_RECORD_COUNT = "tx:providers/count";
export const RECEIVE_PROVIDER_RECORD_COUNT = "rx:providers/count";
export const REQUEST_PROVIDER_RECORD_LIST = "tx:providers/list";
export const RECEIVE_PROVIDER_RECORD_LIST = "rx:providers/list";

function rxAction(endpoint, result) {
  return {
    type: "rx:" + endpoint,
    receivedAt: Date.now(),
    result: result
  };
}

function txAction(endpoint) {
  return {
    type: "tx:" + endpoint
  };
}

function generate(endpoint) {
  return function(dispatch) {
    return function(args) {
      dispatch(txAction(endpoint));

      let sub = endpoint;

      if (args) {
        let keys = Object.getOwnPropertyNames(args);
        let len = keys.length;
        let params = [];
        for (let i = 0; i < len; i++) {
          params.push(keys[i] + "=" + args[keys[i]]);
        }

        sub += "?" + params.join("&");
      }

      return fetch(apiURL(sub))
        .then(
          response => response.json(),
          error => console.error(endpoint, error)
        )
        .then(json =>
          dispatch(
            json.success
              ? rxAction(endpoint, json.result)
              : requestError(endpoint)
          )
        );
    };
  };
}

export const hello = generate("hello");

export const providerCount = generate("providers/count");

export const providerList = generate("providers/list");
