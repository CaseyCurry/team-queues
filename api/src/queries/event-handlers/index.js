import { Dal } from "../dal";
import { LifecycleModifiedHandler } from "./lifecycle-modified-handler";
import { TaskCreatedHandler } from "./task-created-handler";

const EventHandlers = (domainEvents) => {
  const lifecycleModifiedHandler = new LifecycleModifiedHandler(domainEvents, Dal.queueData);
  const taskCreatedHandler = new TaskCreatedHandler(domainEvents, Dal.taskData);
  return {
    lifecycleModified: lifecycleModifiedHandler,
    taskCreated: taskCreatedHandler
  };
};

export { EventHandlers };