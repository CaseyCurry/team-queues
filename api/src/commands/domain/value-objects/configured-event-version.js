import deepFreeze from "deep-freeze";
import { ConfiguredEventVersionMap } from "./configured-event-version-map";

const ConfiguredEventVersion = class {
  constructor({ number, maps }) {
    const errorMessages = [];
    if (!number || typeof number !== "number" || number <= 0) {
      errorMessages.push("The number must be a number greater than 0");
    }
    if (!maps || !maps.find((map) => map.target === "foreignId")) {
      errorMessages.push("The maps must include a map for the foreignId of the event that occurred");
    }
    if (errorMessages.length) {
      errorMessages.push(errorMessages);
    }
    this.number = number;
    this.maps = maps ?
      maps.map((map) => new ConfiguredEventVersionMap(map)) : [];
    deepFreeze(this);
  }
};

export { ConfiguredEventVersion };
