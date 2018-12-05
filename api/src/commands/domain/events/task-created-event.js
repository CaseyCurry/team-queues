import deepFreeze from "deep-freeze";
import { TaggedAggregateEvent } from "./tagged-aggregate-event";

const TaskCreatedEvent = class extends TaggedAggregateEvent {
  constructor(task, item) {
    super({ name: "team-queues.task-created", version: 1, aggregate: item });
    this.message.task = {
      id: task.id,
      item: {
        id: item.id,
        foreignId: item.foreignId,
        lifecycleId: item.lifecycleId
      },
      queueName: task.queueName,
      type: task.type,
      createdOn: task.createdOn,
      status: task.status,
      dueOn: task.dueOn,
      assignee: task.assignee ? { name: task.assignee.name } : task.assignee
    };
    deepFreeze(this);
  }
};

export { TaskCreatedEvent };
