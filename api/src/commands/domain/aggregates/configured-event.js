import { ConfiguredEventVersion } from "../value-objects/configured-event-version";

const getBestVersionMatch = function(occurredEvent) {
  const occurredEventKey = occurredEvent.name + "." + occurredEvent.version;
  let bestMatch = this.bestVersionMatches[occurredEventKey];
  if (!bestMatch) {
    bestMatch = this.versions.find((version) => version.number <= occurredEvent.version);
    if (!bestMatch) {
      throw new Error("There must be a version configured that is less than or equal to the occurring version of the event");
    }
    this.bestVersionMatches[occurredEventKey] = bestMatch;
  }
  return bestMatch;
};

const deepGetProperty = (occurredEvent, source) => {
  const properties = source.split(".");
  let current = occurredEvent;
  for (let i = 0; i < properties.length; ++i) {
    if (current[properties[i]] == undefined) {
      return undefined;
    } else {
      current = current[properties[i]];
    }
  }
  return current;
};

const deepSetProperty = (context, value, target) => {
  const properties = typeof target === "string" ? target.split(".") : target;
  if (properties.length > 1) {
    const firstProperty = properties.shift();
    context[firstProperty] = Object.prototype.toString.call(context[firstProperty]) === "[object Object]" ? context[firstProperty] : {};
    deepSetProperty(
      context[firstProperty],
      value,
      properties);
  } else {
    context[properties[0]] = value;
  }
};

const ConfiguredEvent = class {
  constructor({ name, isActive, versions }) {
    this.name = name;
    this.isActive = isActive;
    this.versions = versions ?
      versions.map((version) => new ConfiguredEventVersion(version)) : [];
    /* Sort in descending order which will increase the performance of finding
       a version match when an event occurs and an exact match is not found. */
    this.versions.sort((x, y) => y.number - x.number);
  }

  configureVersion({ number, maps }) {
    this.versions.push(new ConfiguredEventVersion({ number, maps }));
    this.versions.sort((x, y) => y.number - x.number);
  }

  getContext(occurredEvent) {
    if (occurredEvent.name !== this.name) {
      throw new Error("The occurred event name does not match this configured event");
    }
    if (!this.bestVersionMatches) {
      this.bestVersionMatches = {};
    }
    const version = getBestVersionMatch.call(this, occurredEvent);
    const context = {};
    /* TODO: Considering adding the ability to add and modify the context persisted with a task / item.
       This context may be helpful when rendering the list of tasks which may require some context
       for users when viewing the list. */
    version.maps.forEach((map) => {
      // TODO: Make sure this is strict enough to tell that the event's data is mappable.
      // TODO: Consider supporting compound foreignIds.
      const value = deepGetProperty(occurredEvent, map.source);
      deepSetProperty(context, value, map.target);
    });
    return context;
  }
};

export { ConfiguredEvent };
