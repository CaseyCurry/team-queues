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
    if (!name || typeof name !== "string") {
      throw new Error("The name must have a value and must be a string");
    }
    if (!taskType || typeof taskType !== "string") {
      throw new Error("The taskType must have a value and must be a string");
    }
    this.name = name;
    this.taskType = taskType;
    this.destinationsWhenTaskCreated = destinationsWhenTaskCreated
      ? destinationsWhenTaskCreated.map(destination =>
        DestinationFactory.create(destination)
      )
      : [];
    this.destinationsWhenTaskCompleted = destinationsWhenTaskCompleted
      ? destinationsWhenTaskCompleted.map(destination =>
        DestinationFactory.create(destination)
      )
      : [];
    this.destinationsWhenEventOccurred = destinationsWhenEventOccurred
      ? destinationsWhenEventOccurred.map(destination =>
        DestinationFactory.create(destination)
      )
      : [];
    deepFreeze(this);
  }
};

export { Queue };
