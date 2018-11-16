import { ConditionGroup } from "../../domain/value-objects/condition-group";

const DestinationAdapter = (destination) => {
  const recursivelyAdapt = (obj) => {
    if (obj instanceof ConditionGroup) {
      return {
        [obj.scope.toLowerCase()]: obj.conditions.map((condition) => recursivelyAdapt(condition))
      };
    } else {
      return obj;
    }
  };

  return {
    conditions: recursivelyAdapt(destination.group),
    onTrue: destination.onTrue,
    onFalse: destination.onFalse
  };
};

export { DestinationAdapter };