import { Express } from "express";
import { QueueController } from "./queue-controller";
import { Data } from "../dal/data";

export class Controllers {
  public queue: QueueController;

  constructor(app: Express, data: Data) {
    this.queue = new QueueController(app, data.queue, data.task);
  }
}
