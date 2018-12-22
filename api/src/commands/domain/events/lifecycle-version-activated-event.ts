import deepFreeze from "deep-freeze";
import { Event } from "./event";
import { Lifecycle } from "../aggregates/lifecycle";

export class LifecycleVersionActivatedEvent extends Event {
  constructor(lifecycle: Lifecycle) {
    super({ name: "team-queues.lifecycle-version-activated", version: 1 });
    this.message.lifecycle = {
      id: lifecycle.id,
      lifecycleOf: lifecycle.lifecycleOf,
      version: {
        number: lifecycle.activeVersion!.number,
        queues: lifecycle.activeVersion!.queues.map(queue => {
          return {
            name: queue.name,
            taskType: queue.taskType
          };
        })
      }
    };
    deepFreeze(this);
  }
}
