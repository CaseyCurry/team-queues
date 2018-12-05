import deepFreeze from "deep-freeze";
import { TaggedAggregateEvent } from "./tagged-aggregate-event";

const TaskCompletedEvent = class extends TaggedAggregateEvent {
  constructor(task, item) {
    super({ name: "team-queues.task-completed", version: 1, aggregate: item });
    this.message.task = {
      itemId: task.itemId,
      id: task.id
    };
    deepFreeze(this);
  }
};

export { TaskCompletedEvent };
