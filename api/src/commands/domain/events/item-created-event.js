import deepFreeze from "deep-freeze";
import { BaseEventMetadata } from "./base-event-metadata";

const ItemCreatedEvent = class extends BaseEventMetadata {
  constructor(item) {
    super({ name: "team-queues.item-created", version: 1 });
    this.message.item = {
      id: item.id,
      foreignId: item.foreignId,
      lifecycleId: item.lifecycleId
    };
    deepFreeze(this);
  }
};

export { ItemCreatedEvent };