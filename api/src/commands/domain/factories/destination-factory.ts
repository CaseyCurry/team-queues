import { ConditionalDestination } from "../value-objects/conditional-destination";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import { TriggeredDestination } from "../value-objects/triggered-destination";
import { TriggeredCompletion } from "../value-objects/triggered-completion";
import { DestinationInterface } from "../value-objects/destination-interface";

// TODO: create a destination that only completes a task and doesn't create a new one.
// TODO: is Destination the best name for this considering the above?
export class DestinationFactory {
  public static create(destination: DestinationInterface) {
    if ((destination as any).queueName) {
      return new UnconditionalDestination(destination as any);
    }
    if ((destination as any).group) {
      return new ConditionalDestination(destination as any);
    }
    /* TODO: I should be able to use triggers with WhenTaskCreated. If the eventName starts
       with team-queues then listen locally instead of through the bus? */
    if ((destination as any).doesCompleteItem) {
      return new TriggeredCompletion(destination as any);
    }
    return new TriggeredDestination(destination as any);
  }
}
