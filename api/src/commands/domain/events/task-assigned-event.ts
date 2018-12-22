import deepFreeze from "deep-freeze";
import { TaggedAggregateEvent } from "./tagged-aggregate-event";
import { TaskEventInterface } from "./task-event-interface";
import { Item } from "../aggregates/item";
import { Task } from "../entities/task";

export class TaskAssignedEvent extends TaggedAggregateEvent
  implements TaskEventInterface {
  constructor(task: Task, item: Item) {
    super({ name: "team-queues.task-assigned", version: 1, aggregate: item });
    this.message.task = {
      item: {
        id: item.id
      },
      id: task.id,
      assigneeName: task.assignee!.name
    };
    deepFreeze(this);
  }
}
