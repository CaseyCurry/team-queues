import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import { RulesEngineInterface } from "../../infrastructure/json-rules-engine/rules-engine";
import { UntriggerableDestinationInterface } from "../value-objects/untriggerable-destination-interface";
import { Task } from "../entities/task";
import { Item } from "../aggregates/item";
import { ConditionalDestination } from "../value-objects/conditional-destination";
import { EventContextInterface } from "../value-objects/event-context";

export class DestinationProcessor {
  constructor(private rulesEngine: RulesEngineInterface) {}

  public async process(
    destination: UntriggerableDestinationInterface,
    item: Item,
    eventContext: EventContextInterface,
    incompleteTask?: Task
  ): Promise<void> {
    await this.recursivelyProcess(
      destination,
      item,
      eventContext,
      incompleteTask
    );
  }

  private async recursivelyProcess(
    destination: UntriggerableDestinationInterface,
    item: Item,
    eventContext: EventContextInterface,
    incompleteTask?: Task
  ): Promise<void> {
    if (destination instanceof UnconditionalDestination) {
      await item.createTask(destination, incompleteTask);
    } else {
      const nextDestinations = await this.rulesEngine.getNextDestinations(
        destination as ConditionalDestination,
        eventContext,
        incompleteTask
      );
      for (const nextDestination of nextDestinations) {
        await this.recursivelyProcess(
          nextDestination,
          item,
          eventContext,
          incompleteTask
        );
      }
    }
  }
}
