import deepFreeze from "deep-freeze";
import { DestinationFactory } from "../factories/destination-factory";
import { ConditionGroup } from "./condition-group";

const ConditionalDestination = class {
  constructor({ group, onTrue, onFalse }) {
    const errorMessages = [];
    if (!group) {
      errorMessages.push("The group must be a ConditionGroup");
    }
    if (!onTrue || !Array.isArray(onTrue)) {
      errorMessages.push("The onTrue must be an array");
    }
    if (!onFalse || !Array.isArray(onFalse)) {
      errorMessages.push("The onFalse must be an array");
    }
    if (errorMessages.length) {
      errorMessages.push(errorMessages);
    }
    this.group = new ConditionGroup(group);
    this.onTrue = onTrue.map((destination) => DestinationFactory.create(destination));
    this.onFalse = onFalse.map((destination) => DestinationFactory.create(destination));
    deepFreeze(this);
  }
};

export { ConditionalDestination };
