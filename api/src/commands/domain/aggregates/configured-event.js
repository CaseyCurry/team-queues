import { ConfiguredEventVersion } from "../value-objects/configured-event-version";
import { EventContext } from "../value-objects/event-context";

const getBestVersionMatch = function(occurredEvent) {
  if (!this.bestVersionMatches) {
    this.bestVersionMatches = {};
  }
  const occurredEventKey = occurredEvent.name + "." + occurredEvent.version;
  let bestMatch = this.bestVersionMatches[occurredEventKey];
  if (!bestMatch) {
    bestMatch = this.versions.find(
      version => version.number <= occurredEvent.version
    );
    if (!bestMatch) {
      throw new Error(
        "There must be a version configured that is less than or equal to the occurring version of the event"
      );
    }
    this.bestVersionMatches[occurredEventKey] = bestMatch;
  }
  return bestMatch;
};

const ConfiguredEvent = class {
  constructor({ name, isActive, versions }) {
    if (!name || typeof name !== "string") {
      throw new Error("The name must have a value and must be a string");
    }
    if (!versions || !Array.isArray(versions) || versions.length <= 0) {
      throw new Error(
        "The versions must be an array and have one or more versions"
      );
    }
    this.name = name;
    this.isActive = isActive ? isActive : false;
    this.versions = versions
      ? versions.map(version => new ConfiguredEventVersion(version))
      : [];
    /* Sort in descending order which will increase the performance of finding
       a version match when an event occurs and an exact match is not found. */
    this.versions.sort((x, y) => y.number - x.number);
  }

  getContext(occurredEvent) {
    if (occurredEvent.name !== this.name) {
      throw new Error(
        "The occurred event name does not match this configured event"
      );
    }
    const version = getBestVersionMatch.call(this, occurredEvent);
    return new EventContext(occurredEvent, version.maps);
  }
};

export { ConfiguredEvent };
