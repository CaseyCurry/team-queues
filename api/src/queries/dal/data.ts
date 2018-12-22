import { QueueStore } from "./queue-store";
import { QueueData } from "./queue-data";
import { TaskStore } from "./task-store";
import { TaskData } from "./task-data";

export class Data {
  public queue: QueueData;
  public task: TaskData;
  // TODO: move to config file
  private readonly dbLocation = "mongodb://localhost:27017";
  private readonly dbName = "teamqueuesqueries";

  constructor() {
    const queueStore = new QueueStore(this.dbLocation, this.dbName);
    this.queue = new QueueData(queueStore);
    const taskStore = new TaskStore(this.dbLocation, this.dbName);
    this.task = new TaskData(taskStore);
  }
}
