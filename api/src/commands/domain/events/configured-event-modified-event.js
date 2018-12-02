import deepFreeze from "deep-freeze";
import { BaseEventMetadata } from "./base-event-metadata";

const ConfiguredEventModifiedEvent = class extends BaseEventMetadata {
  constructor(configuredEvent) {
    super({ name: "team-queues.configured-event-modified", version: 1 });
    this.message.lifecycle = {
      name: configuredEvent.name
    };
    deepFreeze(this);
  }
};

export { ConfiguredEventModifiedEvent };
