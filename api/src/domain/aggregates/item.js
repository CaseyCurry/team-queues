import { v4 as uuidv4 } from "uuid";
import { BaseAggregate } from "./base-aggregate";
import { Task } from "../entities/task";
import { TaskStatus } from "../value-objects/task-status";
import { TaskCreatedEvent } from "../events/task-created-event";
import { TaskAssignedEvent } from "../events/task-assigned-event";
import { TaskUnassignedEvent } from "../events/task-unassigned-event";
import { TaskCompletedEvent } from "../events/task-completed-event";
import { ItemCompletedEvent } from "../events/item-completed-event";

const Item = class extends BaseAggregate {
  constructor({ id, foreignId, tasks, lifecycleId }) {
    super();
    this.id = id ? id : uuidv4();
    this.foreignId = foreignId;
    this.tasks = tasks ? tasks : [];
    this.lifecycleId = lifecycleId;

    /* Use defineProperty instead of the shorter form of a getter so that it
       can be set to enumerable so it will be serialized. */
    Object.defineProperty(this, "isComplete", {
      get: () => {
        const incompleteTasks = this.tasks
          .filter((task) => task.status !== TaskStatus.Completed);
        return incompleteTasks.length === 0;
      },
      enumerable: true
    });
  }

  get incompleteTasks() {
    return this.tasks
      .filter((task) => !task.isComplete);
  }

  async createTask(destination, currentTask) {
    const dueOn = new Date();
    const task = new Task({
      itemId: this.id,
      queueId: destination.queueId,
      createdOn: new Date(),
      status: TaskStatus.Unassigned,
      dueOn
    });
    task.applyModification(destination.modification);
    this.tasks.push(task);
    await this.domainEvents.raise(new TaskCreatedEvent(task));
    if (destination.doesCompletePreviousTask &&
      currentTask &&
      !currentTask.isComplete) {
      await this.completeTask(currentTask);
      await this.domainEvents.raise(new TaskCompletedEvent(currentTask));
    }
  }

  async assignTask(task, assignee) {
    // TODO: unit test this function
    task.assign(assignee);
    await this.domainEvents.raise(new TaskAssignedEvent(task));
  }

  async unassignTask(task) {
    // TODO: unit test this function
    task.unassign();
    await this.domainEvents.raise(new TaskUnassignedEvent(task));
  }

  async completeTask(task) {
    task.completeTask();
    // TODO: unit test this event
    if (this.isComplete) {
      await this.domainEvents.raise(new ItemCompletedEvent(this));
    }
  }
};

export { Item };