import deepFreeze from "deep-freeze";
import { BaseEventMetadata } from "./base-event-metadata";

const Event = class extends BaseEventMetadata {
  constructor(task) {
    super({ name: "team-queues.task-created", version: 1 });
    this.message.task = {
      id: task.id,
      itemId: task.itemId,
      queueId: task.queueId,
      createdOn: task.createdOn,
      status: task.status,
      dueOn: task.dueOn,
      assignee: task.assignee ? { name: task.assignee.name } : task.assignee
    };
    deepFreeze(this);
  }
};

export { Event as TaskCreatedEvent };