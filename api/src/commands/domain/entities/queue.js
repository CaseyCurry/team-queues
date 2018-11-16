import { DestinationFactory } from "../factories/destination-factory";

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
      destinationsWhenEventOccurred.map((destination) => DestinationFactory.create(destination)) : [];
  }
};

export { Queue };