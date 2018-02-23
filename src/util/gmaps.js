import { TopToaster } from "../toaster";
import { Intent } from "@blueprintjs/core";

const REJECT = Symbol();

const CACHE = {};

export const METERS_PER_MILE = 1609.34;

const GREEN_PIN =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAArCAYAAACJrvP4AAACBUlEQVR4AbWXvY2sMBSFKYEmKMJl0MEEJJO/hJjkRSQTEEwHzuiDJlzGic7jaLHeLGK5NqyRrizv2OfT/bO9lfWRrFdrQfjVwmogCY3b3Ot3rTtXMiAgRokuDOgx0eHBCm61iho17/Gift/gYzZ08wQzFkRx2xy1fvO8TQKBGLThy4sq2xw6bl4OJigwoEKjjTesoXSkdxq6LJABPAypkmqHLt+ktwHrz/CNSq4tkG/Slf6nV7HqCpj7751iqj5J2rjUrPxq723UPGGf9MVRCL0a09w0r8KvA5ttoA4EcQQLZmEsEj4x/W4XSqiS8uUNmK+T8iaYna/JgE12KEFCsNCgLeqZ9GMYlxZ90Zy1+ENxBJtG+KLVKH1x1GcuEEX7TPrixOMqyNUCJ0gMYfg8iDt1eQmYdKW/v8tCh+FXQdKT7uF9ZuQu28LZEwHE/Mb8K0DpSG/PuH+JWpfmCbALN4slxKJI+dTtA96XgNqn/Tnvxsa6DYxbucl9qPYL894lWq99OZxd7/1NAmmd1t957zsk9h7i+XfnU6+M8DBO9fOeyi+W+gdYnV8UlnevH+48/f2aV4Z3B7AbXhmN/txVpuZGA1/27qE+OuirRwlYvQ+lcdjeD2WLp0DUGENYCuZ7TN/f76U+kkNsAY2al4Q94z+NGjUvCXNfF6ujxngWFs0bSFzJ1z8hAMIp72QFjQAAAABJRU5ErkJggg==";

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

    this._greenPinImage = {
      url: GREEN_PIN
    };

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
    this._invertedPinIndex = {};
    this._currentlyBouncingPins = null;
    this._currentlyHighlightedPins = null;

    this._mouseOverHandler = null;
    this._clickHandler = null;
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

  setMouseOverFunction(newFunction) {
    this._mouseOverHandler = newFunction;
  }

  setClickHandlerFunction(newFunction) {
    this._clickHandler = newFunction;
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

    this.fitToCircle();
  }

  fitToCircle() {
    if (this._circle === null) {
      return;
    }

    const viewCircle = new window.google.maps.Circle({
      center: this._circle.getCenter(),
      radius: this._circle.getRadius() + 200
    });
    this._map.fitBounds(viewCircle.getBounds());
  }

  bouncePinsForID(id) {
    if (this._currentlyBouncingPins) {
      this._currentlyBouncingPins.forEach(marker => marker.setAnimation(null));
      this._currentlyBouncingPins = null;
    }

    if (!id) {
      return;
    }

    const markerSet = this._invertedPinIndex[id];

    if (!markerSet) {
      return;
    }

    const animation = window.google.maps.Animation.BOUNCE;
    markerSet.forEach(marker => marker.setAnimation(animation));
    this._currentlyBouncingPins = markerSet;
  }

  highlightPinsForID(id) {
    if (this._currentlyHighlightedPins) {
      this._currentlyHighlightedPins.forEach(marker => marker.setIcon(null));
      this._currentlyHighlightedPins = null;
    }

    if (!id) {
      return;
    }

    const markerSet = this._invertedPinIndex[id];

    if (!markerSet) {
      return;
    }

    const icon = this._greenPinImage;
    markerSet.forEach(marker => marker.setIcon(icon));
    this._currentlyHighlightedPins = markerSet;
  }

  updatePins(newPins) {
    const center = this._circle ? this._circle.getCenter() : null;
    const radius = this._circle ? this._circle.getRadius() : null;

    // The path to this is annoying
    const distance =
      window.google.maps.geometry.spherical.computeDistanceBetween;

    const mouseOverCallback = this._mouseOverHandler;
    const clickCallback = this._clickHandler;
    const bounds = new window.google.maps.LatLngBounds();

    // Reset this
    this._invertedPinIndex = {};

    // And this
    this.bouncePinsForID(null);
    this.highlightPinsForID(null);

    const count = newPins.length;
    const replacement = {};
    for (let i = 0; i < count; i++) {
      let pin = newPins[i];
      let hash = `${pin.lat}${pin.lng}`;
      let id = pin.id;
      let loc = new window.google.maps.LatLng(pin.lat, pin.lng);

      if (this._circle) {
        // Don't display pins outside this circle
        if (distance(center, loc) > radius) {
          continue;
        }
      } else {
        // If no circle, continue to calculate map bounds
        bounds.extend(loc);
      }

      // If we already have a pin at this hash just save the id to it
      if (replacement[hash]) {
        replacement[hash].ids.add(id);
      } else if (this._pins[hash]) {
        // If this pin already exists but isnt found yet, save it
        replacement[hash] = this._pins[hash];
        replacement[hash].ids = new Set([id]);
      } else {
        // We've never seen this hash before, make a new marker for it
        const newMarker = new window.google.maps.Marker({
          position: loc,
          map: this._map
        });

        newMarker.ids = new Set([id]);
        newMarker.addListener("mouseover", () => {
          if (mouseOverCallback) {
            mouseOverCallback(newMarker.ids);
          }
        });

        newMarker.addListener("click", () => {
          if (clickCallback) {
            clickCallback(newMarker.ids);
          }
        });

        replacement[hash] = newMarker;
      }

      if (id in this._invertedPinIndex) {
        this._invertedPinIndex[id].add(replacement[hash]);
      } else {
        this._invertedPinIndex[id] = new Set([replacement[hash]]);
      }
    }

    // Remove all the pin objects that are no longer used
    const oldHashes = Object.keys(this._pins);
    const oldCount = oldHashes.length;
    for (let i = 0; i < oldCount; i++) {
      let current = oldHashes[i];
      if (!replacement[current]) {
        this._pins[current].setMap(null);
      }
    }

    // Save the new pins
    this._pins = replacement;

    if (this._circle) {
      this.fitToCircle();
    } else if (count > 0) {
      this._map.fitBounds(bounds);
    }
  }
}
