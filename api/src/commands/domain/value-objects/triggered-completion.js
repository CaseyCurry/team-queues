import deepFreeze from "deep-freeze";

const TriggeredCompletion = class {
  constructor({ eventNames, doesCompletePreviousTask, doesCompleteItem }) {
    if (
      !eventNames ||
      !Array.isArray(eventNames) ||
      !eventNames.every(name => typeof name === "string")
    ) {
      throw new Error("The eventNames must be an array");
    }
    this.eventNames = eventNames;
    this.doesCompletePreviousTask = doesCompletePreviousTask ? true : false;
    this.doesCompleteItem = doesCompleteItem ? true : false;
    deepFreeze(this);
  }

  listensFor(eventName) {
    return this.eventNames.includes(eventName);
  }
};

export { TriggeredCompletion };
