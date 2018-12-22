import deepFreeze from "deep-freeze";
import {
  ConfiguredEventVersionMap,
  ConfiguredEventVersionMapInterface
} from "./configured-event-version-map";

export interface ConfiguredEventVersionInterface {
  number: number;
  maps: ConfiguredEventVersionMapInterface[];
}

// FIXME: This is an entity.
export class ConfiguredEventVersion implements ConfiguredEventVersionInterface {
  public number: number;
  public maps: ConfiguredEventVersionMapInterface[];

  constructor({ number, maps }: ConfiguredEventVersionInterface) {
    if (number <= 0) {
      throw new Error("The number must be a number greater than 0");
    }
    if (!maps.find(map => map.target === "foreignId")) {
      throw new Error(
        "The maps must include a map for the foreignId of the event that occurred"
      );
    }
    this.number = number;
    this.maps = maps
      ? maps.map(versionMap => new ConfiguredEventVersionMap(versionMap))
      : [];
    deepFreeze(this);
  }
}
