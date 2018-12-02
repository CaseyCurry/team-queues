import { Dal } from "../dal";
import { LifecycleVersionActivatedHandler } from "./lifecycle-version-activated-handler";
import { TaskCreatedHandler } from "./task-created-handler";

const EventHandlers = (domainEvents) => {
  const lifecycleVersionActivatedHandler = new LifecycleVersionActivatedHandler(domainEvents, Dal.queueData);
  const taskCreatedHandler = new TaskCreatedHandler(domainEvents, Dal.taskData);
  return {
    lifecycleVersionActivated: lifecycleVersionActivatedHandler,
    taskCreated: taskCreatedHandler
  };
};

export { EventHandlers };
