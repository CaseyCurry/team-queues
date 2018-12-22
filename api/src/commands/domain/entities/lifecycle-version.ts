import { Queue, QueueInterface } from "../value-objects/queue";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import {
  TriggeredDestination,
  TriggeredDestinationInterface
} from "../value-objects/triggered-destination";
import { UntriggerableDestinationInterface } from "../value-objects/untriggerable-destination-interface";
import { ConditionalDestination } from "../value-objects/conditional-destination";

export interface LifecycleVersionInterface {
  number: number;
  triggersForItemCreation: TriggeredDestinationInterface[];
  queues: QueueInterface[];
}

export class LifecycleVersion implements LifecycleVersionInterface {
  public number: number;
  public triggersForItemCreation: TriggeredDestinationInterface[];
  public queues: QueueInterface[];

  constructor({
    number,
    triggersForItemCreation,
    queues
  }: {
    number: number;
    triggersForItemCreation?: TriggeredDestinationInterface[];
    queues?: QueueInterface[];
  }) {
    this.number = number;
    this.triggersForItemCreation = triggersForItemCreation
      ? triggersForItemCreation.map(
          trigger => new TriggeredDestination(trigger)
        )
      : [];
    this.queues = queues ? queues.map(queue => new Queue(queue)) : [];
  }

  public addTriggerForItemCreation({
    eventNames,
    destinations
  }: TriggeredDestinationInterface): void {
    const trigger = new TriggeredDestination({ eventNames, destinations });
    const invalidDestinations = this.recursivelyFindInvalidDestinations(
      trigger.destinations,
      this.queues
    );
    if (invalidDestinations && invalidDestinations.length) {
      throw new Error(
        invalidDestinations
          .map(
            destination =>
              `The ${destination.queueName} queue and ${
                destination.taskType
              } task type are not configured`
          )
          .toString()
      );
    }
    this.triggersForItemCreation.push(trigger);
  }

  public addQueue({
    name,
    taskType,
    destinationsWhenTaskCreated,
    destinationsWhenTaskCompleted,
    destinationsWhenEventOccurred
  }: QueueInterface): void {
    const existingQueue = this.queues.find(
      queue => queue.name === name && queue.taskType === taskType
    );
    if (existingQueue) {
      return;
    }
    this.queues.push(
      new Queue({
        name,
        taskType,
        destinationsWhenTaskCreated,
        destinationsWhenTaskCompleted,
        destinationsWhenEventOccurred
      })
    );
  }

  private recursivelyFindInvalidDestinations(
    destinations: UntriggerableDestinationInterface[],
    existingQueues: QueueInterface[]
  ): UnconditionalDestination[] {
    const invalidDestinations: UnconditionalDestination[] = [];
    destinations.map(destination => {
      invalidDestinations.push(
        ...this.findInvalidDestinations(destination, existingQueues)
      );
    });
    return invalidDestinations;
  }

  private findInvalidDestinations(
    destination: UntriggerableDestinationInterface,
    existingQueues: QueueInterface[]
  ): UnconditionalDestination[] {
    const invalidDestinations: UnconditionalDestination[] = [];
    if (destination instanceof UnconditionalDestination) {
      if (this.isQueueMissing(destination, existingQueues)) {
        invalidDestinations.push(destination);
      }
    } else {
      invalidDestinations.push(
        ...this.recursivelyFindInvalidDestinations(
          (destination as ConditionalDestination).onTrue,
          existingQueues
        )
      );
      invalidDestinations.push(
        ...this.recursivelyFindInvalidDestinations(
          (destination as ConditionalDestination).onFalse,
          existingQueues
        )
      );
    }
    return invalidDestinations;
  }

  private isQueueMissing(
    destination: UnconditionalDestination,
    existingQueues: QueueInterface[]
  ): boolean {
    return !existingQueues.find(
      queue =>
        queue.name === destination.queueName &&
        queue.taskType === destination.taskType
    );
  }
}
