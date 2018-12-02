import deepFreeze from "deep-freeze";

// TODO: unit test
const Condition = class {
  constructor({ fact, path, operator, value }) {
    if (!fact || typeof fact !== "string") {
      throw new Error("The fact must have a string value");
    }
    if (!path || typeof path !== "string") {
      throw new Error("The path must have a string value");
    }
    // TODO: create enum of operators
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
