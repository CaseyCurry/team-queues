import deepFreeze from "deep-freeze";
import { Event } from "./event";

const ItemCompletedEvent = class extends Event {
  constructor(item) {
    super({ name: "team-queues.item-completed", version: 1 });
    this.message.item = {
      id: item.id
    };
    deepFreeze(this);
  }
};

export { ItemCompletedEvent };
