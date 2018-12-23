import { Engine as JsonRulesEngine } from "json-rules-engine";
import { DestinationAdapter } from "./destination-adapter";
import { ConditionalDestination } from "../../domain/value-objects/conditional-destination";

const RulesEngine = () => {
  const recursivelyGetNextDestinations = async function(destination, fact) {
    const engine = new JsonRulesEngine();
    const adaptedDestination = DestinationAdapter(destination);
    engine.addRule({
      conditions: adaptedDestination.conditions,
      event: {
        type: "conditionsMet"
      }
    });
    const events = await engine.run(fact);
    const nextDestinations =
      events.length > 0
        ? adaptedDestination.onTrue
        : adaptedDestination.onFalse;
    return concatDestination(nextDestinations, fact);
  };

  const concatDestination = async (nextDestinations, fact) => {
    const unconditionalDestinations = nextDestinations.filter(
      destination => !(destination instanceof ConditionalDestination)
    );
    const nestedDestinations = [];
    for (const destination of nextDestinations.filter(
      destination => destination instanceof ConditionalDestination
    )) {
      nestedDestinations.push(
        await recursivelyGetNextDestinations(destination, fact)
      );
    }
    const flattenedNestedDestinations = nestedDestinations.reduce(
      (x, y) => x.concat(y),
      []
    );
    return unconditionalDestinations.concat(flattenedNestedDestinations);
  };

  return {
    getNextDestinations: async (destination, eventContext, currentTask) => {
      const fact = {
        ["@event"]: eventContext,
        ["@currentTask"]: currentTask ? currentTask : null
      };
      return recursivelyGetNextDestinations(destination, fact);
    }
  };
};

export { RulesEngine };
