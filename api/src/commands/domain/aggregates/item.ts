import { BaseAggregate } from "./base-aggregate";
import { Task } from "../entities/task";
import { TaskStatus } from "../value-objects/task-status";
import { TaskCreatedEvent } from "../events/task-created-event";
import { TaskAssignedEvent } from "../events/task-assigned-event";
import { TaskUnassignedEvent } from "../events/task-unassigned-event";
import { TaskCompletedEvent } from "../events/task-completed-event";
import { ItemCompletedEvent } from "../events/item-completed-event";
import { TeamMember } from "../value-objects/team-member";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";

export class Item extends BaseAggregate {
  public id: string;
  public foreignId: string;
  public tasks: Task[];
  public lifecycleId: string;
  public isComplete: boolean;

  constructor({
    id,
    foreignId,
    tasks,
    lifecycleId,
    isComplete
  }: {
    id: string;
    foreignId: string;
    tasks?: Task[];
    lifecycleId: string;
    isComplete?: boolean;
  }) {
    super();
    this.id = id;
    this.foreignId = foreignId;
    this.tasks = tasks ? tasks.map(task => new Task(task)) : [];
    this.lifecycleId = lifecycleId;
    this.isComplete = isComplete ? true : false;
  }

  public get incompleteTasks(): Task[] {
    return this.tasks.filter(task => !task.isComplete);
  }

  public async createTask(
    destination: UnconditionalDestination,
    currentTask?: Task
  ): Promise<void> {
    // TODO: unit test id
    const task = new Task({
      id: this.getNextTaskId(),
      queueName: destination.queueName,
      type: destination.taskType,
      createdOn: new Date(),
      status: TaskStatus.Unassigned,
      dueOn: new Date()
    });
    task.applyModification(destination.modification);
    this.tasks.push(task);
    // TODO: consider removing ItemCreatedEvent. Item info is added here to make it
    // easier to consume new items being created. Raising when item is created without
    // tasks has questionable value.
    await this.domainEvents.raise(new TaskCreatedEvent(task, this));
    if (
      destination.doesCompletePreviousTask &&
      currentTask &&
      !currentTask.isComplete
    ) {
      await this.completeTask(currentTask);
    }
  }

  public async assignTask(task: Task, assignee: TeamMember): Promise<void> {
    // TODO: unit test this function
    task.assign(assignee);
    await this.domainEvents.raise(new TaskAssignedEvent(task, this));
  }

  public async unassignTask(task: Task): Promise<void> {
    // TODO: unit test this function
    task.unassign();
    await this.domainEvents.raise(new TaskUnassignedEvent(task, this));
  }

  public async completeTask(task: Task): Promise<void> {
    task.complete();
    // TODO: unit test this event
    await this.domainEvents.raise(new TaskCompletedEvent(task, this));
  }

  public async completeItem(): Promise<void> {
    // TODO: unit test this event
    for (const task of this.tasks) {
      await this.completeTask(task);
    }
    this.isComplete = true;
    await this.domainEvents.raise(new ItemCompletedEvent(this));
  }

  private getNextTaskId(): number {
    const sortedTasks = this.tasks.slice().sort((x, y) => y.id - x.id);
    return sortedTasks.length ? sortedTasks[0].id + 1 : 1;
  }
}
