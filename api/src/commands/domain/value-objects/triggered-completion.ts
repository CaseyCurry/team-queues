import deepFreeze from "deep-freeze";
import { TriggerableDestinationInterface } from "./triggerable-destination-interface";
import { DestinationInterface } from "./destination-interface";

export interface TriggeredCompletionInterface {
  eventNames: string[];
  doesCompletePreviousTask: boolean;
  doesCompleteItem: boolean;
}

export class TriggeredCompletion
  implements
    TriggeredCompletionInterface,
    TriggerableDestinationInterface,
    DestinationInterface {
  public eventNames: string[];
  public doesCompletePreviousTask: boolean;
  public doesCompleteItem: boolean;

  constructor({
    eventNames,
    doesCompletePreviousTask,
    doesCompleteItem
  }: TriggeredCompletionInterface) {
    this.eventNames = eventNames;
    this.doesCompletePreviousTask = doesCompletePreviousTask ? true : false;
    this.doesCompleteItem = doesCompleteItem ? true : false;
    deepFreeze(this);
  }

  public listensFor(eventName: string) {
    return this.eventNames.includes(eventName);
  }
}
