import { Engine as JsonRulesEngine } from "json-rules-engine";
import { DestinationAdapter } from "./destination-adapter";
import { UnconditionalDestination } from "../../domain/value-objects/unconditional-destination";
import { ConditionalDestination } from "../../domain/value-objects/conditional-destination";
import { Task } from "../../domain/entities/task";
import { UntriggerableDestinationInterface } from "../../domain/value-objects/untriggerable-destination-interface";
import { EventContextInterface } from "../../domain/value-objects/event-context";

export interface RulesEngineInterface {
  getNextDestinations(
    destination: ConditionalDestination,
    eventContext: EventContextInterface,
    currentTask?: Task
  ): Promise<UnconditionalDestination[]>;
}

export class RulesEngine implements RulesEngineInterface {
  public async getNextDestinations(
    destination: ConditionalDestination,
    eventContext: EventContextInterface,
    currentTask?: Task
  ): Promise<UnconditionalDestination[]> {
    const fact: any = {
      ["@event"]: eventContext,
      ["@currentTask"]: currentTask
    };
    return this.recursivelyGetNextDestinations(destination, fact);
  }

  private async recursivelyGetNextDestinations(
    destination: ConditionalDestination,
    fact: any
  ): Promise<UnconditionalDestination[]> {
    const engine = new JsonRulesEngine();
    const adaptedDestination = DestinationAdapter.adapt(destination);
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
    return this.concatDestination(nextDestinations, fact);
  }

  private async concatDestination(
    nextDestinations: UntriggerableDestinationInterface[],
    fact: any
  ): Promise<UnconditionalDestination[]> {
    const unconditionalDestinations = nextDestinations.filter(
      destination => !(destination instanceof ConditionalDestination)
    );
    const nestedDestinations = [];
    for (const destination of nextDestinations.filter(
      nextDestination => nextDestination instanceof ConditionalDestination
    )) {
      nestedDestinations.push(
        await this.recursivelyGetNextDestinations(
          destination as ConditionalDestination,
          fact
        )
      );
    }
    const flattenedNestedDestinations = nestedDestinations.reduce(
      (x, y) => x.concat(y),
      []
    );
    return (unconditionalDestinations as UnconditionalDestination[]).concat(
      flattenedNestedDestinations
    );
  }
}
