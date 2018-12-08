import { Queue } from "../value-objects/queue";
import { DestinationFactory } from "../factories/destination-factory";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";

const isQueueMissing = (destination, existingQueues) => {
  return !existingQueues
    .find((queue) => queue.name === destination.queueName && queue.taskType === destination.taskType);
};

const findInvalidDestinations = (destination, existingQueues) => {
  const invalidDestinations = [];
  if (destination instanceof UnconditionalDestination) {
    if (isQueueMissing(destination, existingQueues)) {
      invalidDestinations.push(destination);
    }
  } else {
    invalidDestinations.push(...recursivelyFindInvalidDestinations(destination.onTrue, existingQueues));
    invalidDestinations.push(...recursivelyFindInvalidDestinations(destination.onFalse, existingQueues));
  }
  return invalidDestinations;
};

const recursivelyFindInvalidDestinations = (destinations, existingQueues) => {
  const invalidDestinations = [];
  destinations.map((destination) => {
    invalidDestinations.push(...findInvalidDestinations(destination, existingQueues));
  });
  return invalidDestinations;
};

const LifecycleVersion = class {
  constructor({
    number,
    triggersForItemCreation,
    queues
  }) {
    if (!number || typeof number !== "number") {
      throw new Error("The version number must be passed and must be a numeric value");
    }
    this.number = number;
    this.triggersForItemCreation = triggersForItemCreation ?
      triggersForItemCreation.map((trigger) => DestinationFactory.create(trigger)) : [];
    this.queues = queues ?
      queues.map((queue) => new Queue(queue)) : [];
  }

  addTriggerForItemCreation({ eventNames, destinations }) {
    const invalidDestinations = recursivelyFindInvalidDestinations(destinations, this.queues);
    if (invalidDestinations && invalidDestinations.length) {
      throw new Error(invalidDestinations
        .map((destination) => `The ${destination.queueName} queue and ${destination.taskType} task type are not configured`));
    }
    const trigger = DestinationFactory.create({ eventNames, destinations });
    this.triggersForItemCreation.push(trigger);
  }

  addQueue({
    name,
    taskType,
    destinationsWhenTaskCreated,
    destinationsWhenTaskCompleted,
    destinationsWhenEventOccurred
  }) {
    const existingQueue = this.queues
      .find((queue) => queue.name === name && queue.taskType === taskType);
    if (existingQueue) {
      return;
    }
    const queue = new Queue({
      name,
      taskType,
      destinationsWhenTaskCreated,
      destinationsWhenTaskCompleted,
      destinationsWhenEventOccurred
    });
    this.queues.push(queue);
  }
};

export { LifecycleVersion };
