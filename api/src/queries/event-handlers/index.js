import { Dal } from "../dal";
import { LifecycleVersionActivatedHandler } from "./lifecycle-version-activated-handler";
import { TaskCreatedHandler } from "./task-created-handler";
import { TaskCompletedHandler } from "./task-completed-handler";

const EventHandlers = domainEvents => {
  const lifecycleVersionActivatedHandler = new LifecycleVersionActivatedHandler(
    domainEvents,
    Dal.queueData
  );
  const taskCreatedHandler = new TaskCreatedHandler(domainEvents, Dal.taskData);
  const taskCompletedHandler = new TaskCompletedHandler(
    domainEvents,
    Dal.taskData
  );
  return {
    lifecycleVersionActivated: lifecycleVersionActivatedHandler,
    taskCreated: taskCreatedHandler,
    taskCompleted: taskCompletedHandler
  };
};

export { EventHandlers };
