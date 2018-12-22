import { v4 as uuidv4 } from "uuid";
import { BaseAggregate } from "./base-aggregate";
import { Item } from "./item";
import { ItemCreatedEvent } from "../events/item-created-event";
import {
  LifecycleVersion,
  LifecycleVersionInterface
} from "../entities/lifecycle-version";
import { TriggeredCompletion } from "../value-objects/triggered-completion";
import { LifecycleVersionActivatedEvent } from "../../domain/events/lifecycle-version-activated-event";
import {
  TriggeredDestinationInterface,
  TriggeredDestination
} from "../value-objects/triggered-destination";
import { QueueInterface } from "../value-objects/queue";
import { ConfiguredEvent } from "./configured-event";
import { DestinationProcessor } from "../services/destination-processor";
import { EventInterface } from "../events/event";
import { TaskEventInterface } from "../events/task-event-interface";
import { DestinationInterface } from "../value-objects/destination-interface";
import { EventContextInterface } from "../value-objects/event-context";

export class Lifecycle extends BaseAggregate {
  public id: string;
  public lifecycleOf: string;
  public previousVersion?: LifecycleVersionInterface;
  public activeVersion?: LifecycleVersionInterface;
  public nextVersion?: LifecycleVersionInterface;

  constructor({
    id,
    lifecycleOf,
    previousVersion,
    activeVersion,
    nextVersion
  }: {
    id: string;
    lifecycleOf: string;
    previousVersion?: LifecycleVersionInterface;
    activeVersion?: LifecycleVersionInterface;
    nextVersion?: LifecycleVersionInterface;
  }) {
    super();
    this.id = id;
    this.lifecycleOf = lifecycleOf;
    if (previousVersion) {
      this.previousVersion = new LifecycleVersion(previousVersion);
    }
    if (activeVersion) {
      this.activeVersion = new LifecycleVersion(activeVersion);
    }
    if (nextVersion) {
      this.nextVersion = new LifecycleVersion(nextVersion);
    } else {
      this.updateNextVersion({
        triggersForItemCreation: [],
        queues: []
      });
    }
  }

  // TODO: unit test
  public get referencedEvents(): string[] {
    let referencedEvents: string[] = [];
    if (this.activeVersion) {
      const eventsInTriggers = this.activeVersion!.triggersForItemCreation.map(
        trigger => {
          return trigger.eventNames;
        }
      ).reduce((x, y) => x.concat(y), []);
      const eventsInQueues = this.activeVersion!.queues.map(queue => {
        return queue.destinationsWhenEventOccurred;
      })
        .reduce((x, y) => x.concat(y), [])
        .map(trigger => {
          return trigger.eventNames;
        })
        .reduce((x, y) => x.concat(y), []);
      // get distinct events
      referencedEvents = eventsInTriggers
        .concat(eventsInQueues)
        .filter((x, y, z) => z.indexOf(x) === y);
    }
    return referencedEvents;
  }

  // TODO: unit test
  public updateNextVersion({
    triggersForItemCreation,
    queues
  }: {
    triggersForItemCreation: TriggeredDestinationInterface[];
    queues: QueueInterface[];
  }): void {
    const nextVersionNumber = this.activeVersion
      ? this.activeVersion.number + 1
      : 1;
    this.nextVersion = new LifecycleVersion({ number: nextVersionNumber });
    queues.forEach(queue =>
      (this.nextVersion as LifecycleVersion).addQueue(queue)
    );
    triggersForItemCreation.forEach(trigger =>
      (this.nextVersion as LifecycleVersion).addTriggerForItemCreation(trigger)
    );
  }

  // TODO: unit test
  public activateNextVersion(): void {
    this.previousVersion = this.activeVersion;
    this.activeVersion = this.nextVersion;
    this.updateNextVersion({
      triggersForItemCreation: [],
      queues: []
    });
    this.domainEvents.raise(new LifecycleVersionActivatedEvent(this));
  }

  public async processEvent(
    destinationProcessor: DestinationProcessor,
    occurredEvent: EventInterface,
    configuredEvent: ConfiguredEvent,
    itemInLifecycle?: Item
  ): Promise<Item | null> {
    if (!this.activeVersion) {
      // TODO: unit test
      throw new Error("Only active lifecycle versions can process events");
    }
    // TODO: Do I need the configuredEvent here or can I just pass the context from the event handler?
    const eventContext = configuredEvent.getContext(occurredEvent);
    return !itemInLifecycle
      ? this.processEventWhenItemDoesNotExist(
          destinationProcessor,
          occurredEvent,
          eventContext
        )
      : this.processEventWhenItemExists(
          destinationProcessor,
          occurredEvent,
          eventContext,
          itemInLifecycle
        );
  }

  public async createItem(foreignId: string): Promise<Item> {
    if (!foreignId) {
      throw new Error("The foreignId must have a value");
    }
    const item = new Item({
      id: uuidv4(),
      foreignId,
      lifecycleId: this.id
    });
    await this.domainEvents.raise(new ItemCreatedEvent(item));
    return item;
  }

  private async processEventWhenItemDoesNotExist(
    destinationProcessor: DestinationProcessor,
    occurredEvent: EventInterface,
    eventContext: EventContextInterface
  ): Promise<Item | null> {
    const trigger = this.activeVersion!.triggersForItemCreation.find(
      destination =>
        (destination as TriggeredDestination).listensFor(occurredEvent.name)
    );
    if (!trigger) {
      return null;
    }
    const item = await this.createItem(eventContext.foreignId);
    this.listenToTaskEvents(item, eventContext, destinationProcessor);
    for (const destination of trigger.destinations) {
      await destinationProcessor.process(destination, item, eventContext);
    }
    return item;
  }

  private async processEventWhenItemExists(
    destinationProcessor: DestinationProcessor,
    occurredEvent: EventInterface,
    eventContext: EventContextInterface,
    item: Item
  ): Promise<Item> {
    this.listenToTaskEvents(item, eventContext, destinationProcessor);
    for (const incompleteTask of item.incompleteTasks) {
      const trigger = this.activeVersion!.queues.find(
        queue =>
          queue.name === incompleteTask.queueName &&
          queue.taskType === incompleteTask.type
      )!.destinationsWhenEventOccurred.find(destination =>
        (destination as TriggeredDestination).listensFor(occurredEvent.name)
      );
      // TODO: refactor these nested if statements
      if (trigger) {
        if (trigger instanceof TriggeredCompletion) {
          if (trigger.doesCompleteItem) {
            await item.completeItem();
          } else if (trigger.doesCompletePreviousTask) {
            await item.completeTask(incompleteTask);
          }
        } else {
          for (const destination of (trigger as TriggeredDestination)
            .destinations) {
            await destinationProcessor.process(
              destination,
              item,
              eventContext,
              incompleteTask
            );
          }
        }
      }
    }
    return item;
  }

  private listenToTaskEvents(
    item: Item,
    eventContext: EventContextInterface,
    destinationProcessor: DestinationProcessor
  ): void {
    this.activeVersion!.queues.forEach(queue => {
      if (queue.destinationsWhenTaskCreated.length) {
        this.listenToTaskEvent(
          queue,
          item,
          "team-queues.task-created",
          queue.destinationsWhenTaskCreated,
          eventContext,
          destinationProcessor
        );
      }
      if (queue.destinationsWhenTaskCompleted.length) {
        this.listenToTaskEvent(
          queue,
          item,
          "team-queues.task-completed",
          queue.destinationsWhenTaskCompleted,
          eventContext,
          destinationProcessor
        );
      }
    });
  }

  private listenToTaskEvent(
    queue: QueueInterface,
    item: Item,
    eventName: string,
    destinations: DestinationInterface[],
    eventContext: EventContextInterface,
    destinationProcessor: DestinationProcessor
  ): void {
    destinations.forEach(destination => {
      item.domainEvents.listen(eventName, async (event: TaskEventInterface) => {
        /* Get the task from the item because the one in the event is an incomplete copy
           of the original. */
        const task = item.tasks.find(
          copyOfTask => copyOfTask.id === event.message.task.id
        );
        if (queue.name === task!.queueName && queue.taskType === task!.type) {
          await destinationProcessor.process(
            destination,
            item,
            eventContext,
            task
          );
        }
      });
    });
  }
}
