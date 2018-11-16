import deepFreeze from "deep-freeze";
import { BaseEventMetadata } from "./base-event-metadata";

const TaskCreatedEvent = class extends BaseEventMetadata {
  constructor(task, item) {
    super({ name: "team-queues.task-created", version: 1 });
    this.message.task = {
      id: task.id,
      item: {
        id: item.id,
        foreignId: item.foreignId,
        lifecycleId: item.lifecycleId
      },
      queueId: task.queueId,
      createdOn: task.createdOn,
      status: task.status,
      dueOn: task.dueOn,
      assignee: task.assignee ? { name: task.assignee.name } : task.assignee
    };
    deepFreeze(this);
  }
};

export { TaskCreatedEvent };