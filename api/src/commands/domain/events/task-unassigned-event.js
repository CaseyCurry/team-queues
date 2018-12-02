import deepFreeze from "deep-freeze";
import { BaseEventMetadata } from "./base-event-metadata";

const TaskUnassignedEvent = class extends BaseEventMetadata {
  constructor(task) {
    super({ name: "team-queues.task-unassigned", version: 1 });
    this.message.task = {
      itemId: task.itemId,
      id: task.id
    };
    deepFreeze(this);
  }
};

export { TaskUnassignedEvent };
