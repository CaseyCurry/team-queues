import { UnconditionalDestination } from "../value-objects/unconditional-destination";

const DestinationProcessor = rulesEngine => {
  const recursivelyProcess = async (
    destination,
    item,
    eventContext,
    incompleteTask
  ) => {
    if (destination instanceof UnconditionalDestination) {
      await item.createTask(destination, incompleteTask);
    } else {
      const nextDestinations = await rulesEngine.getNextDestinations(
        destination,
        eventContext,
        incompleteTask
      );
      for (const nextDestination of nextDestinations) {
        await recursivelyProcess(
          nextDestination,
          item,
          eventContext,
          incompleteTask
        );
      }
    }
  };

  return {
    process: recursivelyProcess
  };
};

export { DestinationProcessor };
