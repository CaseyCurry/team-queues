import deepFreeze from "deep-freeze";
import { Event } from "./event";
import { ConfiguredEvent } from "../aggregates/configured-event";

export class ConfiguredEventModifiedEvent extends Event {
  constructor(configuredEvent: ConfiguredEvent) {
    super({ name: "team-queues.configured-event-modified", version: 1 });
    this.message.lifecycle = {
      name: configuredEvent.name
    };
    deepFreeze(this);
  }
}
