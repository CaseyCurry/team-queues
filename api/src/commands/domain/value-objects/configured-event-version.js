import deepFreeze from "deep-freeze";
import { ConfiguredEventVersionMap } from "./configured-event-version-map";

// TODO: I believe this is an entity.
const ConfiguredEventVersion = class {
  constructor({ number, maps }) {
    if (!number || typeof number !== "number" || number <= 0) {
      throw new Error("The number must be a number greater than 0");
    }
    if (
      !maps ||
      !Array.isArray(maps) ||
      !maps.find(map => map.target === "foreignId")
    ) {
      throw new Error(
        "The maps must be an array that at least includes a map for the foreignId of the event that occurred"
      );
    }
    this.number = number;
    this.maps = maps.map(map => new ConfiguredEventVersionMap(map));
    deepFreeze(this);
  }
};

export { ConfiguredEventVersion };
