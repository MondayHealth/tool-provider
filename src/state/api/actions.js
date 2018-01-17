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

export const REQUEST_HELLO = "REQUEST_HELLO";
function requestHello() {
  return {
    type: REQUEST_HELLO
  };
}

export const RECEIVE_HELLO = "RECEIVE_HELLO";
function receiveHello(result) {
  return {
    type: RECEIVE_HELLO,
    receivedAt: Date.now(),
    user: result
  };
}

export function hello(dispatch) {
  return function() {
    dispatch(requestHello());

    const REQ = "hello";

    return fetch(apiURL(REQ))
      .then(response => response.json(), error => console.error(REQ, error))
      .then(json =>
        dispatch(json.success ? receiveHello(json.result) : requestError(REQ))
      );
  };
}
