import { Lifecycle } from "../aggregates/lifecycle";
import { LifecycleStatus } from "../value-objects/lifecycle-status";

const LifecycleFactory = {
  create: ({
    id,
    lifecycleOf,
    version,
    triggersForItemCreation,
    queues
  }) => {
    // Do not generate the lifecycle id here because it demotes idempotency. Force the client to generate an id.
    // TODO: validate that events in lifecycle are configured
    // TODO: the queue id should just be a next number instead of a guid
    if (!triggersForItemCreation) {
      triggersForItemCreation = [];
    }
    if (!queues) {
      queues = [];
    }
    const status = LifecycleStatus.WorkInProgress;
    const lifecycle = new Lifecycle({
      id,
      lifecycleOf,
      version,
      status,
      triggersForItemCreation: [],
      queues: []
    });
    queues.forEach((queue) => lifecycle.createQueue(queue));
    triggersForItemCreation.forEach((trigger) => lifecycle.createTriggerForItemCreation(trigger));
    return lifecycle;
  }
};

export { LifecycleFactory };
