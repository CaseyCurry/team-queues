import deepFreeze from "deep-freeze";
import { BaseEventMetadata } from "./base-event-metadata";

const LifecycleVersionActivatedEvent = class extends BaseEventMetadata {
  constructor(lifecycle) {
    super({ name: "team-queues.lifecycle-version-activated", version: 1 });
    this.message.lifecycle = {
      id: lifecycle.id,
      lifecycleOf: lifecycle.lifecycleOf,
      version: {
        number: lifecycle.activeVersion.number,
        queues: lifecycle.activeVersion.queues.map((queue) => {
          return {
            name: queue.name,
            taskType: queue.taskType
          };
        })
      }
    };
    deepFreeze(this);
  }
};

export { LifecycleVersionActivatedEvent };
