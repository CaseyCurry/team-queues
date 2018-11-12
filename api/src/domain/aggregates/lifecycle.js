import { v4 as uuidv4 } from "uuid";
import { BaseAggregate } from "./base-aggregate";
import { Item } from "./item";
import { ItemCreatedEvent } from "../events/item-created-event";
import { Queue } from "../entities/queue";
import { Trigger } from "../value-objects/trigger";

const Lifecycle = class extends BaseAggregate {
  constructor({ id, lifecycleOf, version, isActive, triggersForItemCreation, queues }) {
    super();
    this.id = id;
    this.lifecycleOf = lifecycleOf;
    this.version = version;
    this.isActive = isActive;
    this.triggersForItemCreation = triggersForItemCreation ?
      triggersForItemCreation.map((trigger) => new Trigger(trigger)) : [];
    this.queues = queues ?
      queues.map((queue) => new Queue(queue)) : [];
  }

  async processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle) {
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

  createQueue({
    id,
    name,
    taskType,
    destinationsWhenTaskCreated,
    destinationsWhenTaskCompleted,
    destinationsWhenEventOccurred
  }) {
    // TODO: fix tests and then remove id from params
    id = id ? id : uuidv4();
    if (!name || typeof name !== "string") {
      throw new Error("The name must have a value and must be a string");
    }
    if (!taskType || typeof taskType !== "string") {
      throw new Error("The taskType must have a value and must be a string");
    }
    const queue = new Queue({
      id,
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
    const trigger = new Trigger({ eventNames, destinations });
    this.triggersForItemCreation.push(trigger);
  }
};

const processEventWhenItemDoesNotExist = async function(destinationProcessor, occurredEvent, eventContext) {
  const trigger = this.triggersForItemCreation
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
    const trigger = this.queues
      .find((queue) => queue.id === incompleteTask.queueId)
      .destinationsWhenEventOccurred
      .find((trigger) => trigger.listensFor(occurredEvent.name));
    if (trigger) {
      for (const destination of trigger.destinations) {
        await destinationProcessor.process(destination, item, eventContext, incompleteTask);
      }
    }
  }
  return item;
};

const listenToTaskEvents = function(item, eventContext, destinationProcessor) {
  this.queues.forEach((queue) => {
    if (queue.destinationsWhenTaskCreated.length) {
      listenToTaskEvent(
        queue.id,
        item,
        "team-queues.task-created",
        queue.destinationsWhenTaskCreated,
        eventContext,
        destinationProcessor);
    }
    if (queue.destinationsWhenTaskCompleted) {
      listenToTaskEvent(
        queue.id,
        item,
        "team-queues.task-completed",
        queue.destinationsWhenTaskCompleted,
        eventContext,
        destinationProcessor);
    }
  });
};

const listenToTaskEvent = (queueId, item, eventName, destinations, eventContext, destinationProcessor) => {
  destinations.forEach((destination) => {
    item.domainEvents.listen(eventName, async (event) => {
      /* Get the task from the item because the one in the event is an incomplete copy
         of the original. */
      const task = item.tasks.find((task) => task.id === event.message.task.id);
      if (queueId === task.queueId) {
        await destinationProcessor.process(destination, item, eventContext, task);
      }
    });
  });
};

export { Lifecycle };