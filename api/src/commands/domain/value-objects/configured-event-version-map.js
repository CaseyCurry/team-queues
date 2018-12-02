import deepFreeze from "deep-freeze";

// TODO: unit test
const ConfiguredEventVersionMap = class {
  constructor({ source, target }) {
    // TODO: security scrub source and target
    if (!source || typeof source !== "string") {
      throw new Error("The source must have a string value");
    }
    if (!target || typeof target !== "string") {
      throw new Error("The source must have a string value");
    }
    this.source = source;
    this.target = target;
    deepFreeze(this);
  }
};

export { ConfiguredEventVersionMap };
