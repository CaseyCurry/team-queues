import { Dal } from "../dal";
import { QueueController } from "./queue-controller";

const Controllers = app => {
  const queueController = new QueueController(app, Dal.queueData, Dal.taskData);
  return {
    queue: queueController
  };
};

export { Controllers };
