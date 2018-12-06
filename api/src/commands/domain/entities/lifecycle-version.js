import { Queue } from "../value-objects/queue";
import { DestinationFactory } from "../factories/destination-factory";

// TODO: unit test
const LifecycleVersion = class {
  constructor({
    number,
    triggersForItemCreation,
    queues
  }) {
    const errorMessages = [];
    if (!number || typeof number !== "number") {
      errorMessages.push("The version number must be passed and must be a numeric value");
    }
    if (!Array.isArray(triggersForItemCreation)) {
      errorMessages.push("The triggersForItemCreation must be an array");
    }
    if (!Array.isArray(queues)) {
      errorMessages.push("The queues must be an array");
    }
    if (errorMessages.length) {
      throw new Error(errorMessages);
    }
    this.number = number;
    this.triggersForItemCreation = triggersForItemCreation ?
      triggersForItemCreation.map((trigger) => DestinationFactory.create(trigger)) : [];
    this.queues = queues ?
      queues.map((queue) => new Queue(queue)) : [];
  }

  createQueue({
    name,
    taskType,
    destinationsWhenTaskCreated,
    destinationsWhenTaskCompleted,
    destinationsWhenEventOccurred
  }) {
    const queue = new Queue({
      name,
      taskType,
      destinationsWhenTaskCreated,
      destinationsWhenTaskCompleted,
      destinationsWhenEventOccurred
    });
    this.queues.push(queue);
  }

  createTriggerForItemCreation({
    eventNames,
    destinations
  }) {
    const trigger = DestinationFactory.create({ eventNames, destinations });
    this.triggersForItemCreation.push(trigger);
  }
};

export { LifecycleVersion };
