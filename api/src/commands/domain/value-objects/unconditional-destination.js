import deepFreeze from "deep-freeze";
import { Modification } from "./modification";

const UnconditionalDestination = class {
  constructor({ queueName, taskType, modification, doesCompletePreviousTask }) {
    const errorMessages = [];
    if (!queueName || typeof queueName !== "string") {
      errorMessages.push("The queueName must have a value and must be a string");
    }
    if (!taskType || typeof taskType !== "string") {
      errorMessages.push("The taskType must have a value and must be a string");
    }
    if (errorMessages.length) {
      throw new Error(errorMessages);
    }
    this.queueName = queueName;
    this.taskType = taskType;
    if (modification) {
      this.modification = new Modification(modification);
    }
    this.doesCompletePreviousTask = doesCompletePreviousTask ? true : false;
    deepFreeze(this);
  }
};

export { UnconditionalDestination };
