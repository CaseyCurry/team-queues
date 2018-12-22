import { DomainEvents } from "../../commands/infrastructure/kafka/domain-events";
import { TaskData } from "../dal/task-data";

export class TaskCompletedHandler {
  constructor(private domainEvents: DomainEvents, private taskData: TaskData) {}

  public async register(): Promise<void> {
    this.domainEvents.listenAndHandleOnce(
      "team-queues.task-completed",
      this.handler
    );
  }

  private async handler(event: any): Promise<void> {
    const task = event.message.task;
    console.debug(
      `handling ${event.name} for task ${task.id} in item ${task.itemId}`
    );
    const existingTasks = await this.taskData.getByItemId(task.itemId);
    if (
      !existingTasks
        .map((existingTask: any) => existingTask.id)
        .includes(task.id)
    ) {
      return;
    }
    await this.taskData.delete(task, existingTasks, event.message.etag);
  }
}
