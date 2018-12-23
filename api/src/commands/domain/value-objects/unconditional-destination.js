import deepFreeze from "deep-freeze";
import { Modification } from "./modification";

const UnconditionalDestination = class {
  constructor({ queueName, taskType, modification, doesCompletePreviousTask }) {
    if (!queueName || typeof queueName !== "string") {
      throw new Error("The queueName must have a value and must be a string");
    }
    if (!taskType || typeof taskType !== "string") {
      throw new Error("The taskType must have a value and must be a string");
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
