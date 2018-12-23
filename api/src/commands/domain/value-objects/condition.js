import deepFreeze from "deep-freeze";

const Condition = class {
  constructor({ fact, path, operator, value }) {
    if (!fact || typeof fact !== "string") {
      throw new Error("The fact must have a string value");
    }
    if (!path || typeof path !== "string") {
      throw new Error("The path must have a string value");
    }
    // TODO: create enum of operators from this doc...
    // https://github.com/CacheControl/json-rules-engine/blob/28a5c8e558268b89e3b4a11bc879e4e339f029eb/docs/rules.md#operators
    if (!operator || typeof operator !== "string") {
      throw new Error("The operator must have a string value");
    }
    if (value === undefined) {
      throw new Error("The value must not be undefined");
    }
    this.fact = fact;
    this.path = path;
    this.operator = operator;
    this.value = value;
    deepFreeze(this);
  }
};

export { Condition };
