import deepFreeze from "deep-freeze";
import { Event } from "./event";
import { Item } from "../aggregates/item";

export class ItemCompletedEvent extends Event {
  constructor(item: Item) {
    super({ name: "team-queues.item-completed", version: 1 });
    this.message.item = {
      id: item.id
    };
    deepFreeze(this);
  }
}
