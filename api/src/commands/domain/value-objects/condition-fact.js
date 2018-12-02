import deepFreeze from "deep-freeze";

// TODO: unit test
// TODO: Support querying the state of the item. For example, is there a task in some queue for this item?
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
