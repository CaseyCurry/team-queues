import deepFreeze from "deep-freeze";

// TODO: Consider supporting creating conditions on the state of the item. For example, is there a task in some queue for this item?
const ConditionFact = class {
  constructor(eventContext, currentTask) {
    const errorMessages = [];
    if (!eventContext) {
      errorMessages.push("The eventContext must have a value");
    }
    if (errorMessages.length) {
      throw new Error(errorMessages);
    }
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
