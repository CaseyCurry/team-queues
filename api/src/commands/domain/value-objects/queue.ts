import deepFreeze from "deep-freeze";
import { DestinationFactory } from "../factories/destination-factory";
import { DestinationInterface } from "./destination-interface";
import { TriggerableDestinationInterface } from "./triggerable-destination-interface";

export interface QueueInterface {
  name: string;
  taskType: string;
  destinationsWhenTaskCreated: DestinationInterface[];
  destinationsWhenTaskCompleted: DestinationInterface[];
  destinationsWhenEventOccurred: TriggerableDestinationInterface[];
}

export class Queue implements QueueInterface {
  public name: string;
  public taskType: string;
  public destinationsWhenTaskCreated: DestinationInterface[];
  public destinationsWhenTaskCompleted: DestinationInterface[];
  public destinationsWhenEventOccurred: TriggerableDestinationInterface[];

  constructor({
    name,
    taskType,
    destinationsWhenTaskCreated,
    destinationsWhenTaskCompleted,
    destinationsWhenEventOccurred
  }: {
    name: string;
    taskType: string;
    destinationsWhenTaskCreated?: DestinationInterface[];
    destinationsWhenTaskCompleted?: DestinationInterface[];
    destinationsWhenEventOccurred?: TriggerableDestinationInterface[];
  }) {
    // TODO: Add option to hide queue. If performance allows, display if it is not empty.
    this.name = name;
    this.taskType = taskType;
    this.destinationsWhenTaskCreated = destinationsWhenTaskCreated
      ? destinationsWhenTaskCreated.map(destination =>
          DestinationFactory.create(destination)
        )
      : [];
    this.destinationsWhenTaskCompleted = destinationsWhenTaskCompleted
      ? destinationsWhenTaskCompleted.map(destination =>
          DestinationFactory.create(destination)
        )
      : [];
    this.destinationsWhenEventOccurred = destinationsWhenEventOccurred
      ? destinationsWhenEventOccurred.map(
          destination =>
            DestinationFactory.create(
              destination
            ) as TriggerableDestinationInterface
        )
      : [];
    deepFreeze(this);
  }
}
