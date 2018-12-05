import deepFreeze from "deep-freeze";

const Condition = class {
  constructor({ fact, path, operator, value }) {
    const errorMessages = [];
    if (!fact || typeof fact !== "string") {
      errorMessages.push("The fact must have a string value");
    }
    if (!path || typeof path !== "string") {
      errorMessages.push("The path must have a string value");
    }
    // TODO: create enum of operators from this doc...
    // https://github.com/CacheControl/json-rules-engine/blob/28a5c8e558268b89e3b4a11bc879e4e339f029eb/docs/rules.md#operators
    if (!operator || typeof operator !== "string") {
      errorMessages.push("The operator must have a string value");
    }
    if (value === undefined) {
      errorMessages.push("The value must not be undefined");
    }
    if (errorMessages.length) {
      errorMessages.push(errorMessages);
    }
    this.fact = fact;
    this.path = path;
    this.operator = operator;
    this.value = value;
    deepFreeze(this);
  }
};

export { Condition };
