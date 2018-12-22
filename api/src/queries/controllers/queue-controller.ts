import { Express, Request, Response, NextFunction } from "express";
import { QueueData } from "../dal/queue-data";
import { TaskData } from "../dal/task-data";

export class QueueController {
  constructor(
    private app: Express,
    private queueData: QueueData,
    private taskData: TaskData
  ) {}

  public register() {
    this.app.get(
      "/api/queries/queues",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const queues = await this.queueData.getAll();
          response.status(200).send(queues);
        } catch (error) {
          next(error);
        }
      }
    );

    // TODO: add lifecycle of in the query
    this.app.get(
      "/api/queries/queues/:queueName/task-types/:type/tasks",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const queueName = request.params.queueName;
          const type = request.params.type;
          const tasks = await this.taskData.getByQueue(queueName, type);
          response.status(200).send(tasks);
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
