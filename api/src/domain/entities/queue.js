import { DestinationFactory } from "../factories/destination-factory";
import { Trigger } from "../value-objects/trigger";

const Queue = class {
  constructor({
    id,
    name,
    taskType,
    destinationsWhenTaskCreated,
    destinationsWhenTaskCompleted,
    destinationsWhenEventOccurred
  }) {
    this.id = id;
    this.name = name;
    this.taskType = taskType;
    this.destinationsWhenTaskCreated = destinationsWhenTaskCreated ?
      destinationsWhenTaskCreated.map((destination) => DestinationFactory.create(destination)) : [];
    this.destinationsWhenTaskCompleted = destinationsWhenTaskCompleted ?
      destinationsWhenTaskCompleted.map((destination) => DestinationFactory.create(destination)) : [];
    this.destinationsWhenEventOccurred = destinationsWhenEventOccurred ?
      destinationsWhenEventOccurred.map((trigger) => new Trigger(trigger)) : [];
  }
};

export { Queue };