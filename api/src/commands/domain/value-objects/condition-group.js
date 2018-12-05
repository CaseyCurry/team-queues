import deepFreeze from "deep-freeze";
import { Condition } from "./condition";
import { ConditionScope } from "./condition-scope";

const ConditionGroup = class {
  constructor({ scope, conditions }) {
    const errorMessages = [];
    if (!scope || !ConditionScope[scope]) {
      errorMessages.push("The scope must be a valid ConditionScope");
    }
    if (!conditions || !Array.isArray(conditions)) {
      errorMessages.push("The conditions must be an array");
    }
    if (errorMessages.length) {
      errorMessages.push(errorMessages);
    }
    this.scope = scope;
    this.conditions = conditions.map((condition) => {
      return condition.scope ? new ConditionGroup(condition) : new Condition(condition);
    });
    deepFreeze(this);
  }
};

export { ConditionGroup };
