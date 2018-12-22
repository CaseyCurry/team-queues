import deepFreeze from "deep-freeze";
import { Modification, ModificationInterface } from "./modification";
import { UntriggerableDestinationInterface } from "./untriggerable-destination-interface";
import { DestinationInterface } from "./destination-interface";

export interface UnconditionalDestinationInterface {
  queueName: string;
  taskType: string;
  modification?: ModificationInterface;
  doesCompletePreviousTask: boolean;
}

export class UnconditionalDestination
  implements
    UnconditionalDestinationInterface,
    UntriggerableDestinationInterface,
    DestinationInterface {
  public queueName: string;
  public taskType: string;
  public modification?: Modification;
  public doesCompletePreviousTask: boolean;

  constructor({
    queueName,
    taskType,
    modification,
    doesCompletePreviousTask
  }: UnconditionalDestinationInterface) {
    if (!queueName || typeof queueName !== "string") {
      throw new Error("queueName must have a string value");
    }
    if (!taskType || typeof taskType !== "string") {
      throw new Error("taskType must have a string value");
    }
    this.queueName = queueName;
    this.taskType = taskType;
    this.modification = modification
      ? new Modification(modification)
      : undefined;
    this.doesCompletePreviousTask = doesCompletePreviousTask
      ? doesCompletePreviousTask
      : false;
    deepFreeze(this);
  }
}
