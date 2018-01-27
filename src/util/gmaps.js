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

export default class Map {
  constructor(element, center) {
    this._zoom = 14;
    this._center = center || { lat: 40.7127753, lng: -74.0059728 };
    this._circle = null;

    const mapConfig = Object.assign(
      {},
      {
        center: this._center,
        zoom: this._zoom,
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP
      }
    );

    this._map = new window.google.maps.Map(element, mapConfig);
  }

  center(newCenter) {
    this._center = newCenter;
    this._map.setCenter(this._center);
  }

  circle(radius) {
    if (!this._circle) {
      this._circle = new window.google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: this._map,
        center: this._center,
        radius: radius
      });
      return;
    }

    this._circle.setRadius(radius);
  }
}
