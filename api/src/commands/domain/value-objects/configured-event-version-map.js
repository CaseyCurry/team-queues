import deepFreeze from "deep-freeze";

const ConfiguredEventVersionMap = class {
  constructor({ source, target }) {
    const errorMessages = [];
    // TODO: security scrub source and target
    if (!source || typeof source !== "string") {
      errorMessages.push("The source must have a string value");
    }
    if (!target || typeof target !== "string") {
      errorMessages.push("The source must have a string value");
    }
    if (errorMessages.length) {
      errorMessages.push(errorMessages);
    }
    this.source = source;
    this.target = target;
    deepFreeze(this);
  }
};

export { ConfiguredEventVersionMap };
