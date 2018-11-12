import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import { ConditionFact } from "../value-objects/condition-fact";

// TODO: Is "processor" the best name to add to the DSL?
const DestinationProcessor = class {
  constructor(rulesEngine) {
    this.rulesEngine = rulesEngine;
  }

  async process(destination, item, eventContext, incompleteTask) {
    if (destination instanceof UnconditionalDestination) {
      await item.createTask(destination, incompleteTask);
    } else {
      const fact = new ConditionFact(eventContext, incompleteTask);
      const nextDestinations = await this.rulesEngine.getNextDestinations(destination, fact);
      for (const nextDestination of nextDestinations) {
        await this.process(nextDestination, item, eventContext, incompleteTask);
      }
    }
  }
};

export { DestinationProcessor };