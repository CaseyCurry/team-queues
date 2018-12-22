import deepFreeze from "deep-freeze";
import { DestinationFactory } from "../factories/destination-factory";
import { TriggerableDestinationInterface } from "./triggerable-destination-interface";
import { UntriggerableDestinationInterface } from "./untriggerable-destination-interface";
import { DestinationInterface } from "./destination-interface";

export interface TriggeredDestinationInterface {
  eventNames: string[];
  destinations: UntriggerableDestinationInterface[];
}

export class TriggeredDestination
  implements
    TriggeredDestinationInterface,
    TriggerableDestinationInterface,
    DestinationInterface {
  public eventNames: string[];
  public destinations: UntriggerableDestinationInterface[];

  constructor({ eventNames, destinations }: TriggeredDestinationInterface) {
    this.eventNames = eventNames;
    this.destinations = destinations.map((destination: any) =>
      DestinationFactory.create(destination)
    );
    deepFreeze(this);
  }

  public listensFor(eventName: string) {
    return this.eventNames.includes(eventName);
  }
}
