import { ConditionalDestination } from "../value-objects/conditional-destination";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";

const DestinationFactory = {
  create: ({ queueId, modification, doesCompletePreviousTask, group, onTrue, onFalse }) => {
    if (queueId) {
      return new UnconditionalDestination({ queueId, modification, doesCompletePreviousTask });
    } else {
      return new ConditionalDestination({ group, onTrue, onFalse });
    }
  }
};

export { DestinationFactory };