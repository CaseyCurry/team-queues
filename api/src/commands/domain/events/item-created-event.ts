import deepFreeze from "deep-freeze";
import { Event } from "./event";
import { Item } from "../aggregates/item";

export class ItemCreatedEvent extends Event {
  constructor(item: Item) {
    super({ name: "team-queues.item-created", version: 1 });
    this.message.item = {
      id: item.id,
      foreignId: item.foreignId,
      lifecycleId: item.lifecycleId
    };
    deepFreeze(this);
  }
}
