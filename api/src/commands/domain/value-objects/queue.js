import deepFreeze from "deep-freeze";
import { DestinationFactory } from "../factories/destination-factory";

const Queue = class {
  constructor({
    name,
    taskType,
    destinationsWhenTaskCreated,
    destinationsWhenTaskCompleted,
    destinationsWhenEventOccurred
  }) {
    // TODO: Add option to hide queue. If performance allows, display if it is not empty.
    const errorMessages = [];
    if (!name || typeof name !== "string") {
      errorMessages.push("The name must have a value and must be a string");
    }
    if (!taskType || typeof taskType !== "string") {
      errorMessages.push("The taskType must have a value and must be a string");
    }
    if (errorMessages.length) {
      throw new Error(errorMessages);
    }
    this.name = name;
    this.taskType = taskType;
    this.destinationsWhenTaskCreated = destinationsWhenTaskCreated ?
      destinationsWhenTaskCreated.map((destination) => DestinationFactory.create(destination)) : [];
    this.destinationsWhenTaskCompleted = destinationsWhenTaskCompleted ?
      destinationsWhenTaskCompleted.map((destination) => DestinationFactory.create(destination)) : [];
    this.destinationsWhenEventOccurred = destinationsWhenEventOccurred ?
      destinationsWhenEventOccurred.map((destination) => DestinationFactory.create(destination)) : [];
    deepFreeze(this);
  }
};

export { Queue };
