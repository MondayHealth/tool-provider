import { TopToaster } from "../toaster";
import { Intent } from "@blueprintjs/core";

const REJECT = Symbol();

const CACHE = {};

export const METERS_PER_MILE = 1609.34;

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
        styles: Map.getStyles(),
        mapTypeId: window.google.maps.MapTypeId.ROADMAP
      }
    );

    this._map = new window.google.maps.Map(element, mapConfig);

    // We're all NUMTOTS here
    const transitLayer = new window.google.maps.TransitLayer();
    transitLayer.setMap(this._map);

    this._pins = {};
  }

  static getStyles() {
    return [
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }]
      }
    ];
  }

  center(newCenter) {
    this._center = newCenter;
    this._map.setCenter(this._center);
  }

  circle(radius) {
    if (!this._circle) {
      this._circle = new window.google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.15,
        map: this._map,
        center: this._center,
        radius: radius * METERS_PER_MILE
      });
    } else {
      this._circle.setRadius(radius * METERS_PER_MILE);
      this._circle.setCenter(this._center);
    }
  }

  fitToCircle() {
    const basis = this._circle;
    if (!basis) {
      return;
    }
    const viewCircle = new window.google.maps.Circle({
      center: basis.getCenter(),
      radius: basis.getRadius() + 200
    });
    this._map.fitBounds(viewCircle.getBounds());
  }

  updatePins(newPins) {
    let count = newPins.length;
    const replacement = {};
    for (let i = 0; i < count; i++) {
      let pin = newPins[i];
      let hash = `${pin.title}${pin.lat}${pin.lng}`;
      if (hash in this._pins) {
        replacement[hash] = this._pins[hash];
      } else {
        replacement[hash] = new window.google.maps.Marker({
          position: { lat: pin.lat, lng: pin.lng },
          map: this._map,
          title: pin.title
        });
      }
    }

    const oldHashes = Object.keys(this._pins);
    count = oldHashes.length;
    let culled = 0;
    for (let i = 0; i < count; i++) {
      let current = oldHashes[i];
      if (!replacement[current]) {
        this._pins[current].setMap(null);
        culled++;
      }
    }
    console.log("culled", culled, "new", newPins.length);
    this._pins = replacement;
  }
}
