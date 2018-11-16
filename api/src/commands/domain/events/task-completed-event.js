import deepFreeze from "deep-freeze";
import { BaseEventMetadata } from "./base-event-metadata";

const TaskCompletedEvent = class extends BaseEventMetadata {
  constructor(task) {
    super({ name: "team-queues.task-completed", version: 1 });
    this.message.task = {
      id: task.id
    };
    deepFreeze(this);
  }
};

export { TaskCompletedEvent };