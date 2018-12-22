import deepFreeze from "deep-freeze";
import { TaggedAggregateEvent } from "./tagged-aggregate-event";
import { Item } from "../aggregates/item";
import { Task } from "../entities/task";
import { TaskEventInterface } from "./task-event-interface";

export const name = "team-queues.task-created";

export class TaskCreatedEvent extends TaggedAggregateEvent
  implements TaskEventInterface {
  constructor(task: Task, item: Item) {
    super({ name, version: 1, aggregate: item });
    this.message.task = {
      id: task.id,
      item: {
        id: item.id,
        foreignId: item.foreignId,
        lifecycleId: item.lifecycleId
      },
      queueName: task.queueName,
      type: task.type,
      createdOn: task.createdOn,
      status: task.status,
      dueOn: task.dueOn,
      assignee: task.assignee ? { name: task.assignee.name } : task.assignee
    };
    deepFreeze(this);
  }
}
