import { BaseAggregate } from "./base-aggregate";
import { Task } from "../entities/task";
import { TaskStatus } from "../value-objects/task-status";
import { TaskCreatedEvent } from "../events/task-created-event";
import { TaskAssignedEvent } from "../events/task-assigned-event";
import { TaskUnassignedEvent } from "../events/task-unassigned-event";
import { TaskCompletedEvent } from "../events/task-completed-event";
import { ItemCompletedEvent } from "../events/item-completed-event";

const getNextTaskId = tasks => {
  return tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
};

const Item = class extends BaseAggregate {
  constructor({ id, foreignId, tasks, lifecycleId, isComplete }) {
    super();
    this.id = id;
    this.foreignId = foreignId;
    this.tasks = tasks ? tasks.map(task => new Task(task)) : [];
    this.lifecycleId = lifecycleId;
    this.isComplete = isComplete;
  }

  get incompleteTasks() {
    return this.tasks.filter(task => !task.isComplete);
  }

  async createTask(destination, currentTask) {
    const task = new Task({
      id: getNextTaskId(this.tasks),
      queueName: destination.queueName,
      type: destination.taskType,
      createdOn: new Date(),
      status: TaskStatus.Unassigned,
      dueOn: new Date()
    });
    task.applyModification(destination.modification);
    this.tasks.push(task);
    /* TODO: consider removing ItemCreatedEvent. Item info is added here to make it
       easier to consume new items being created. Raising when item is created without
       tasks has questionable value. */
    await this.domainEvents.raise(new TaskCreatedEvent(task, this));
    if (
      destination.doesCompletePreviousTask &&
      currentTask &&
      !currentTask.isComplete
    ) {
      await this.completeTask(currentTask);
    }
  }

  async assignTask(task, assignee) {
    task.assign(assignee);
    await this.domainEvents.raise(new TaskAssignedEvent(task, this));
  }

  async unassignTask(task) {
    task.unassign();
    await this.domainEvents.raise(new TaskUnassignedEvent(task, this));
  }

  async completeTask(task) {
    task.complete();
    await this.domainEvents.raise(new TaskCompletedEvent(task, this));
  }

  async completeItem() {
    for (const task of this.tasks) {
      await this.completeTask(task);
    }
    this.isComplete = true;
    await this.domainEvents.raise(new ItemCompletedEvent(this));
  }
};

export { Item };
