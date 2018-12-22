import { ConditionGroup } from "../../domain/value-objects/condition-group";
import { Condition } from "../../domain/value-objects/condition";
import { ConditionalDestination } from "../../domain/value-objects/conditional-destination";

export class DestinationAdapter {
  public static adapt(destination: ConditionalDestination): any {
    return {
      conditions: DestinationAdapter.recursivelyAdapt(destination.group),
      onTrue: destination.onTrue,
      onFalse: destination.onFalse
    };
  }

  private static recursivelyAdapt(obj: ConditionGroup | Condition): any {
    if (obj instanceof ConditionGroup) {
      return {
        [obj.scope.toLowerCase()]: obj.conditions.map(condition =>
          DestinationAdapter.recursivelyAdapt(condition)
        )
      };
    } else {
      return obj;
    }
  }
}
