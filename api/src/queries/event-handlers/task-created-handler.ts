import { TaskData } from "../dal/task-data";
import { DomainEvents } from "../../commands/infrastructure/kafka/domain-events";

export class TaskCreatedHandler {
  constructor(private domainEvents: DomainEvents, private taskData: TaskData) {}

  public async register() {
    this.domainEvents.listenAndHandleOnce(
      "team-queues.task-created",
      this.handler
    );
  }

  private async handler(event: any): Promise<void> {
    const task = event.message.task;
    console.debug(
      `handling ${event.name} for task ${task.id} in item ${task.item.id}`
    );
    const existingTasks = await this.taskData.getByItemId(task.item.id);
    if (
      existingTasks
        .map((existingTask: any) => existingTask.id)
        .includes(task.id)
    ) {
      return;
    }
    await this.taskData.create(task, existingTasks, event.message.etag);
  }
}
