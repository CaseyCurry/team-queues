import { Dal } from "../dal";
import { QueueController } from "./queue-controller";
import { TaskController } from "./task-controller";

const Controllers = (app) => {
  const queueController = new QueueController(app, Dal.queueData);
  const taskController = new TaskController(app, Dal.taskData);
  return {
    queue: queueController,
    task: taskController
  };
};

export { Controllers };