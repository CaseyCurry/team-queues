import deepFreeze from "deep-freeze";
import { Event } from "./event";

const ConfiguredEventModifiedEvent = class extends Event {
  constructor(configuredEvent) {
    super({ name: "team-queues.configured-event-modified", version: 1 });
    this.message.lifecycle = {
      name: configuredEvent.name
    };
    deepFreeze(this);
  }
};

export { ConfiguredEventModifiedEvent };
