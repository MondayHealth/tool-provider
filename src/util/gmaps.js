import { TopToaster } from "../toaster";
import { Intent } from "@blueprintjs/core";

const REJECT = Symbol();

const CACHE = {};

export function geocode(address) {
  if (address in CACHE) {
    let val = CACHE[address];
    return val !== REJECT
      ? Promise.resolve(CACHE[address])
      : Promise.reject("CACHE");
  }

  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, function ggrh(results, status) {
      // noinspection JSValidateTypes
      if (status !== "OK") {
        TopToaster.show({
          message: `Request for ${address} failed: ${status}`,
          timeout: 3500,
          intent: Intent.DANGER,
          iconName: "error"
        });
        CACHE[address] = REJECT;
        reject(status);
        return;
      }

      if (results.length < 1) {
        TopToaster.show({
          message: `No results for address '${address}'`,
          intent: Intent.WARNING,
          iconName: "error",
          timeout: 3500
        });
        return;
      }

      if (results.length > 1) {
        TopToaster.show({
          message: `Multiple results for address ${address}`,
          intent: Intent.WARNING,
          iconName: "error",
          timeout: 3500
        });
      }

      const result = results[0];

      CACHE[address] = result;

      resolve(result);
    });
  });
}