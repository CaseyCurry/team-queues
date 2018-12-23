import deepFreeze from "deep-freeze";
import { TaggedAggregateEvent } from "./tagged-aggregate-event";

const TaskUnassignedEvent = class extends TaggedAggregateEvent {
  constructor(task, item) {
    super({ name: "team-queues.task-unassigned", version: 1, aggregate: item });
    this.message.task = {
      item: {
        id: item.id
      },
      id: task.id
    };
    deepFreeze(this);
  }
};

export { TaskUnassignedEvent };
