import deepFreeze from "deep-freeze";
import { DestinationFactory } from "../factories/destination-factory";
import { ConditionGroup, ConditionGroupInterface } from "./condition-group";
import { UntriggerableDestinationInterface } from "./untriggerable-destination-interface";
import { DestinationInterface } from "./destination-interface";

export interface ConditionalDestinationInterface {
  group: ConditionGroupInterface;
  onTrue: UntriggerableDestinationInterface[];
  onFalse: UntriggerableDestinationInterface[];
}

export class ConditionalDestination
  implements
    ConditionalDestinationInterface,
    UntriggerableDestinationInterface,
    DestinationInterface {
  public group: ConditionGroupInterface;
  public onTrue: UntriggerableDestinationInterface[];
  public onFalse: UntriggerableDestinationInterface[];

  constructor({ group, onTrue, onFalse }: ConditionalDestinationInterface) {
    this.group = new ConditionGroup(group);
    this.onTrue = onTrue.map(destination =>
      DestinationFactory.create(destination)
    );
    this.onFalse = onFalse.map(destination =>
      DestinationFactory.create(destination)
    );
    deepFreeze(this);
  }
}
