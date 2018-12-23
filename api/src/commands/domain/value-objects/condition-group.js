import deepFreeze from "deep-freeze";
import { Condition } from "./condition";
import { ConditionScope } from "./condition-scope";

const ConditionGroup = class {
  constructor({ scope, conditions }) {
    if (!scope || !ConditionScope[scope]) {
      throw new Error("The scope must be a valid ConditionScope");
    }
    if (!conditions || !Array.isArray(conditions)) {
      throw new Error("The conditions must be an array");
    }
    this.scope = scope;
    this.conditions = conditions.map(condition => {
      return condition.scope
        ? new ConditionGroup(condition)
        : new Condition(condition);
    });
    deepFreeze(this);
  }
};

export { ConditionGroup };
