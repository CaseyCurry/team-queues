import deepFreeze from "deep-freeze";
import { DestinationFactory } from "../factories/destination-factory";
import { ConditionGroup } from "./condition-group";

// TODO: unit test
const ConditionalDestination = class {
  constructor({ group, onTrue, onFalse }) {
    if (!group) {
      throw new Error("The group must be a ConditionGroup");
    }
    if (!onTrue || !Array.isArray(onTrue)) {
      throw new Error("The onTrue must be an array");
    }
    if (!onFalse || !Array.isArray(onFalse)) {
      throw new Error("The onFalse must be an array");
    }
    this.group = new ConditionGroup(group);
    this.onTrue = onTrue.map((destination) => DestinationFactory.create(destination));
    this.onFalse = onFalse.map((destination) => DestinationFactory.create(destination));
    deepFreeze(this);
  }
};

export { ConditionalDestination };
