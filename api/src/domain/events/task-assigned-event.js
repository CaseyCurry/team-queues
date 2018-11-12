import deepFreeze from "deep-freeze";
import { BaseEventMetadata } from "./base-event-metadata";

const Event = class extends BaseEventMetadata {
  constructor(task) {
    super({ name: "team-queues.task-assigned", version: 1 });
    this.message.task = {
      id: task.id,
      assigneeName: task.assignee.name
    };
    deepFreeze(this);
  }
};

export { Event as TaskAssignedEvent };