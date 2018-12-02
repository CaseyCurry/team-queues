import deepFreeze from "deep-freeze";
import { ConfiguredEventVersionMap } from "./configured-event-version-map";

// TODO: unit test
const ConfiguredEventVersion = class {
  constructor({ number, maps }) {
    if (!number || typeof number !== "number" || number <= 0) {
      throw new Error("The number must be a number greater than 0");
    }
    if (!maps || !maps.find((map) => map.target === "foreignId")) {
      throw new Error("The maps must include a map for the foreignId of the event that occurred");
    }
    this.number = number;
    this.maps = maps ?
      maps.map((map) => new ConfiguredEventVersionMap(map)) : [];
    deepFreeze(this);
  }
};

export { ConfiguredEventVersion };
