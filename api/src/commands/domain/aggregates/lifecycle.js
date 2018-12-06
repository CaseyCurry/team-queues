import { BaseAggregate } from "./base-aggregate";
import { Item } from "./item";
import { ItemCreatedEvent } from "../events/item-created-event";
import { LifecycleVersion } from "../entities/lifecycle-version";
import { TriggeredCompletion } from "../value-objects/triggered-completion";
import { LifecycleVersionActivatedEvent } from "../../domain/events/lifecycle-version-activated-event";

const Lifecycle = class extends BaseAggregate {
  constructor({
    id,
    lifecycleOf,
    previousVersion,
    activeVersion,
    nextVersion
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
    this.nextVersion = nextVersion ?
      new LifecycleVersion(nextVersion) : this.createNextVersion({
        triggersForItemCreation: [],
        queues: []
      });
  }

  // TODO: unit test
  get referencedEvents() {
    let referencedEvents = [];
    if (this.activeVersion) {
      const eventsInTriggers = this.activeVersion.triggersForItemCreation
        .map((trigger) => {
          return trigger.eventNames;
        })
        .reduce((x, y) => x.concat(y), []);
      const eventsInQueues = this.activeVersion.queues
        .map((queue) => {
          return queue.destinationsWhenEventOccurred;
        })
        .reduce((x, y) => x.concat(y), [])
        .map((trigger) => {
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
  createNextVersion({ triggersForItemCreation, queues }) {
    const nextVersionNumber = this.activeVersion ? this.activeVersion.number + 1 : 1;
    this.nextVersion = new LifecycleVersion({
      number: nextVersionNumber,
      triggersForItemCreation,
      queues
    });
  }

  // TODO: unit test
  activateNextVersion() {
    this.previousVersion = this.activeVersion;
    this.activeVersion = this.nextVersion;
    this.createNextVersion({
      triggersForItemCreation: [],
      queues: []
    });
    this.domainEvents.raise(new LifecycleVersionActivatedEvent(this));
  }

  async processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle) {
    if (!this.activeVersion) {
      // TODO: unit test
      throw new Error("Only active lifecycle versions can process events");
    }
    // TODO: Do I need the configuredEvent here or can I just pass the context from the event handler?
    const eventContext = configuredEvent.getContext(occurredEvent);
    return !itemInLifecycle ?
      await processEventWhenItemDoesNotExist.call(
        this,
        destinationProcessor,
        occurredEvent,
        eventContext) :
      await processEventWhenItemExists.call(
        this,
        destinationProcessor,
        occurredEvent,
        eventContext,
        itemInLifecycle);
  }

  async createItem(foreignId) {
    if (!foreignId) {
      throw new Error("The foreignId must have a value");
    }
    const item = new Item({
      foreignId: foreignId,
      lifecycleId: this.id
    });
    await this.domainEvents.raise(new ItemCreatedEvent(item));
    return item;
  }
};

const processEventWhenItemDoesNotExist = async function(destinationProcessor, occurredEvent, eventContext) {
  const trigger = this.activeVersion.triggersForItemCreation
    .find((trigger) => trigger.listensFor(occurredEvent.name));
  if (trigger) {
    const item = await this.createItem(eventContext.foreignId);
    listenToTaskEvents.call(this, item, eventContext, destinationProcessor);
    for (const destination of trigger.destinations) {
      await destinationProcessor.process(destination, item, eventContext);
    }
    return item;
  }
};

const processEventWhenItemExists = async function(destinationProcessor, occurredEvent, eventContext, item) {
  listenToTaskEvents.call(this, item, eventContext, destinationProcessor);
  for (const incompleteTask of item.incompleteTasks) {
    const trigger = this.activeVersion.queues
      .find((queue) => queue.name === incompleteTask.queueName && queue.taskType === incompleteTask.type)
      .destinationsWhenEventOccurred
      .find((trigger) => trigger.listensFor(occurredEvent.name));
    // TODO: refactor these nested if statements
    if (trigger) {
      if (trigger instanceof TriggeredCompletion) {
        if (trigger.doesCompleteItem) {
          await item.completeItem();
        } else if (trigger.doesCompletePreviousTask) {
          await item.completeTask(incompleteTask);
        }
      } else {
        for (const destination of trigger.destinations) {
          await destinationProcessor.process(destination, item, eventContext, incompleteTask);
        }
      }
    }
  }
  return item;
};

const listenToTaskEvents = function(item, eventContext, destinationProcessor) {
  this.activeVersion.queues.forEach((queue) => {
    if (queue.destinationsWhenTaskCreated.length) {
      listenToTaskEvent(
        queue,
        item,
        "team-queues.task-created",
        queue.destinationsWhenTaskCreated,
        eventContext,
        destinationProcessor);
    }
    if (queue.destinationsWhenTaskCompleted.length) {
      listenToTaskEvent(
        queue,
        item,
        "team-queues.task-completed",
        queue.destinationsWhenTaskCompleted,
        eventContext,
        destinationProcessor);
    }
  });
};

const listenToTaskEvent = (queue, item, eventName, destinations, eventContext, destinationProcessor) => {
  destinations.forEach((destination) => {
    item.domainEvents.listen(eventName, async (event) => {
      /* Get the task from the item because the one in the event is an incomplete copy
         of the original. */
      const task = item.tasks.find((task) => task.id === event.message.task.id);
      if (queue.name === task.queueName && queue.taskType === task.type) {
        await destinationProcessor.process(destination, item, eventContext, task);
      }
    });
  });
};

export { Lifecycle };
