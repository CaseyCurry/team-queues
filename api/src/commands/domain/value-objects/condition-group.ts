import deepFreeze from "deep-freeze";
import { Condition, ConditionInterface } from "./condition";
import { ConditionScope } from "./condition-scope";

export interface ConditionGroupInterface {
  scope: ConditionScope;
  conditions: (ConditionGroup | Condition)[];
}

export class ConditionGroup implements ConditionGroupInterface {
  public scope: ConditionScope;
  public conditions: (ConditionGroup | Condition)[];

  constructor({ scope, conditions }: ConditionGroupInterface) {
    this.scope = scope;
    this.conditions = conditions.map(condition => {
      return (condition as ConditionGroupInterface).scope
        ? new ConditionGroup(condition as ConditionGroupInterface)
        : new Condition(condition as ConditionInterface);
    });
    deepFreeze(this);
  }
}
