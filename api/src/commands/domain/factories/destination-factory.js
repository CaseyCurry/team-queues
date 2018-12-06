import { ConditionalDestination } from "../value-objects/conditional-destination";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import { TriggeredDestination } from "../value-objects/triggered-destination";
import { TriggeredCompletion } from "../value-objects/triggered-completion";

// TODO: create a destination that only completes a task and doesn't create a new one.
// TODO: is Destination the best name for this considering the above?
const DestinationFactory = {
  create: ({
    queueName,
    taskType,
    modification,
    doesCompletePreviousTask,
    group,
    onTrue,
    onFalse,
    eventNames,
    destinations,
    doesCompleteItem
  }) => {
    if (queueName) {
      return new UnconditionalDestination({
        queueName,
        taskType,
        modification,
        doesCompletePreviousTask
      });
    }
    if (group) {
      return new ConditionalDestination({
        group,
        onTrue,
        onFalse
      });
    }
    /* TODO: I should be able to use triggers with WhenTaskCreated. If the eventName starts
       with team-queues then listen locally instead of through the bus. */
    if (doesCompleteItem) {
      return new TriggeredCompletion({
        eventNames,
        doesCompletePreviousTask,
        doesCompleteItem
      });
    }
    return new TriggeredDestination({
      eventNames,
      destinations
    });
  }
};

export { DestinationFactory };
