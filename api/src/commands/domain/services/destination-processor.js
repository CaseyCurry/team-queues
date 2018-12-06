import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import { ConditionFact } from "../value-objects/condition-fact";

const DestinationProcessor = (rulesEngine) => {
  const process = async (destination, item, eventContext, incompleteTask) => {
    if (destination instanceof UnconditionalDestination) {
      await item.createTask(destination, incompleteTask);
    } else {
      const fact = new ConditionFact(eventContext, incompleteTask);
      const nextDestinations = await rulesEngine.getNextDestinations(destination, fact);
      for (const nextDestination of nextDestinations) {
        await process(nextDestination, item, eventContext, incompleteTask);
      }
    }
  };

  return { process };
};

export { DestinationProcessor };
