import deepFreeze from "deep-freeze";
import { Event } from "./event";

const ItemCreatedEvent = class extends Event {
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
