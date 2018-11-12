import deepFreeze from "deep-freeze";

const ConditionFact = class {
  constructor(eventContext, currentTask) {
    this["@event"] = eventContext;
    if (currentTask) {
      this["@currentTask"] = {
        createdOn: currentTask.createdOn,
        status: currentTask.status,
        dueOn: currentTask.dueOn
      };
    }
    deepFreeze(this);
  }
};

export { ConditionFact };