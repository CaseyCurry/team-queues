import { LifecycleVersionActivatedHandler } from "./lifecycle-version-activated-handler";
import { TaskCreatedHandler } from "./task-created-handler";
import { TaskCompletedHandler } from "./task-completed-handler";
import { DomainEvents } from "../../commands/infrastructure/kafka/domain-events";
import { Data } from "../dal/data";

export class EventHandlers {
  public lifecycleVersionActivated: LifecycleVersionActivatedHandler;
  public taskCreated: TaskCreatedHandler;
  public taskCompleted: TaskCompletedHandler;

  constructor(domainEvents: DomainEvents, data: Data) {
    const lifecycleVersionActivatedHandler = new LifecycleVersionActivatedHandler(
      domainEvents,
      data.queue
    );
    const taskCreatedHandler = new TaskCreatedHandler(domainEvents, data.task);
    const taskCompletedHandler = new TaskCompletedHandler(
      domainEvents,
      data.task
    );
    this.lifecycleVersionActivated = lifecycleVersionActivatedHandler;
    this.taskCreated = taskCreatedHandler;
    this.taskCompleted = taskCompletedHandler;
  }
}
