import deepFreeze from "deep-freeze";
import { BaseEventMetadata } from "./base-event-metadata";

const LifecycleModifiedEvent = class extends BaseEventMetadata {
  constructor(lifecycle) {
    super({ name: "team-queues.lifecycle-modified", version: 1 });
    this.message.lifecycle = {
      id: lifecycle.id,
      lifecycleOf: lifecycle.lifecycleOf,
      version: lifecycle.versions,
      status: lifecycle.status,
      queues: lifecycle.queues.map((queue) => {
        return {
          id: queue.id,
          name: queue.name,
          taskType: queue.taskType
        };
      })
    };
    deepFreeze(this);
  }
};

export { LifecycleModifiedEvent };
