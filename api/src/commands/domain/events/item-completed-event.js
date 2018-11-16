import deepFreeze from "deep-freeze";
import { BaseEventMetadata } from "./base-event-metadata";

const ItemCompletedEvent = class extends BaseEventMetadata {
  constructor(item) {
    super({ name: "team-queues.item-completed", version: 1 });
    this.message.item = {
      id: item.id
    };
    deepFreeze(this);
  }
};

export { ItemCompletedEvent };