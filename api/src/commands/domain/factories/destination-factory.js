import { ConditionalDestination } from "../value-objects/conditional-destination";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import { TriggeredDestination } from "../value-objects/triggered-destination";
import { TriggeredCompletion } from "../value-objects/triggered-completion";

// TODO: create a destination that only completes a task and doesn't create a new one.
// TODO: is Destination the best name for this considering the above?
const DestinationFactory = {
  create: destination => {
    if (destination.queueName) {
      return new UnconditionalDestination(destination);
    }
    if (destination.group) {
      return new ConditionalDestination(destination);
    }
    /* TODO: I should be able to use triggers with WhenTaskCreated. If the eventName starts
       with team-queues then listen locally instead of through the bus. */
    if (destination.doesCompleteItem) {
      return new TriggeredCompletion(destination);
    }
    return new TriggeredDestination(destination);
  }
};

export { DestinationFactory };
