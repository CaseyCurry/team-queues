import deepFreeze from "deep-freeze";
import { EventInterface } from "../events/event";
import { ConfiguredEventVersionMapInterface } from "./configured-event-version-map";

export interface EventContextInterface {
  foreignId: string;
  [prop: string]: any;
}

// TODO: unit test
export class EventContext implements EventContextInterface {
  public foreignId: string;

  constructor(
    occurredEvent: EventInterface,
    maps: ConfiguredEventVersionMapInterface[]
  ) {
    /* TODO: Considering adding the ability to add and modify the context persisted with a task / item.
       This context may be helpful when rendering the list of tasks which may require some context
       for users when viewing the list. */
    maps.forEach((map: ConfiguredEventVersionMapInterface) => {
      // TODO: Make sure this is strict enough to tell that the event's data is mappable.
      // TODO: Consider supporting compound foreignIds.
      const value = this.deepGetProperty(occurredEvent, map.source);
      this.deepSetProperty(this, value, map.target);
    });
    // This is only here so that the compiler knows the foreign id has been set explicitly
    this.foreignId = (this as any).foreignId;
    deepFreeze(this);
  }

  private deepGetProperty(occurredEvent: any, source: string) {
    const properties = source.split(".");
    let current = occurredEvent;
    for (const property of properties) {
      if (current[property] === undefined) {
        return undefined;
      } else {
        current = current[property];
      }
    }
    return current;
  }

  private deepSetProperty(context: any, value: any, target: any) {
    const properties = typeof target === "string" ? target.split(".") : target;
    if (properties.length > 1) {
      const firstProperty: string = properties.shift();
      context[firstProperty] =
        Object.prototype.toString.call(context[firstProperty]) ===
        "[object Object]"
          ? context[firstProperty]
          : {};
      this.deepSetProperty(context[firstProperty], value, properties);
    } else {
      context[properties[0]] = value;
    }
  }
}
