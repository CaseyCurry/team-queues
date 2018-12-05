import deepFreeze from "deep-freeze";
import { TaggedAggregateEvent } from "./tagged-aggregate-event";

const TaskAssignedEvent = class extends TaggedAggregateEvent {
  constructor(task, item) {
    super({ name: "team-queues.task-assigned", version: 1, aggregate: item });
    this.message.task = {
      itemId: task.itemId,
      id: task.id,
      assigneeName: task.assignee.name
    };
    deepFreeze(this);
  }
};

export { TaskAssignedEvent };
