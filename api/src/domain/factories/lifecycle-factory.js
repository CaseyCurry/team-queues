import validate from "uuid-validate";
import { Lifecycle } from "../aggregates/lifecycle";

const LifecycleFactory = {
  create: ({ id, lifecycleOf, version, isActive, triggersForItemCreation, queues }) => {
    // TODO: validate that events in lifecycle are configured
    const errorMessages = [];
    if (!id || !validate(id)) {
      errorMessages.push("The id must be a v4 uuid");
    }
    if (!lifecycleOf || typeof lifecycleOf !== "string") {
      errorMessages.push("The lifecycleOf must have a value and must be a string");
    }
    if (!version || typeof version !== "number" || version < 0) {
      errorMessages.push("The version must be a number greater than 0");
    }
    isActive = isActive ? true : false;
    if (!triggersForItemCreation) {
      triggersForItemCreation = [];
    }
    if (!Array.isArray(triggersForItemCreation)) {
      errorMessages.push("The triggersForItemCreation must be an array");
    }
    if (!queues) {
      queues = [];
    }
    if (!Array.isArray(queues)) {
      errorMessages.push("The queues must be an array");
    }
    if (errorMessages.length) {
      throw new Error(errorMessages);
    }
    const lifecycle = new Lifecycle({ id, lifecycleOf, version, isActive });
    queues.forEach((queue) => lifecycle.createQueue(queue));
    triggersForItemCreation.forEach((trigger) => lifecycle.createTriggerForItemCreation(trigger));
    return lifecycle;
  }
};

export { LifecycleFactory };