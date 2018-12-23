import deepFreeze from "deep-freeze";
import { ConfiguredEventVersionMap } from "./configured-event-version-map";

const deepGetProperty = (occurredEvent, source) => {
  const properties = source.split(".");
  let current = occurredEvent;
  for (const property of properties) {
    if (current[property] === undefined) {
      return null;
    } else {
      current = current[property];
    }
  }
  return current;
};

const deepSetProperty = (context, value, target) => {
  const properties = typeof target === "string" ? target.split(".") : target;
  if (properties.length > 1) {
    const firstProperty = properties.shift();
    context[firstProperty] =
      Object.prototype.toString.call(context[firstProperty]) ===
      "[object Object]"
        ? context[firstProperty]
        : {};
    deepSetProperty(context[firstProperty], value, properties);
  } else {
    context[properties[0]] = value;
  }
};

// TODO: unit test
const EventContext = class {
  constructor(occurredEvent, maps) {
    /* TODO: Considering adding the ability to add and modify the context persisted with a task / item.
       This context may be helpful when rendering the list of tasks which may require some context
       for users when viewing the list. */
    maps.forEach(map => {
      // TODO: Make sure this is strict enough to tell that the event's data is mappable.
      // TODO: Consider supporting compound foreignIds.
      const value = deepGetProperty(occurredEvent, map.source);
      deepSetProperty(this, value, map.target);
    });
    deepFreeze(this);
  }
};

export { EventContext };
