import deepFreeze from "deep-freeze";

const TeamMember = class {
  constructor({ name }) {
    if (!name || typeof name !== "string") {
      throw new Error("The name must have a value");
    }
    this.name = name;
    deepFreeze(this);
  }
};

export { TeamMember };
