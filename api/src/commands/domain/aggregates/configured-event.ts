import {
  ConfiguredEventVersion,
  ConfiguredEventVersionInterface
} from "../value-objects/configured-event-version";
import { BaseAggregate } from "./base-aggregate";
import { EventInterface } from "../events/event";
import { EventContext } from "../value-objects/event-context";

export class ConfiguredEvent extends BaseAggregate {
  public readonly name: string;
  public isActive: boolean;
  public versions: ConfiguredEventVersionInterface[];
  private bestVersionMatches: any = {};

  constructor({
    name,
    isActive,
    versions
  }: {
    name: string;
    isActive: boolean;
    versions: ConfiguredEventVersionInterface[];
  }) {
    super();
    this.name = name;
    this.isActive = isActive;
    this.versions = versions.map(
      version => new ConfiguredEventVersion(version)
    );
    /* Sort in descending order which will increase the performance of finding
       a version match when an event occurs and an exact match is not found. */
    this.versions.sort((x, y) => y.number - x.number);
  }

  public getContext(occurredEvent: EventInterface): EventContext {
    if (occurredEvent.name !== this.name) {
      throw new Error(
        "The occurred event name does not match this configured event"
      );
    }
    const version = this.getBestVersionMatch(occurredEvent);
    return new EventContext(occurredEvent, version.maps);
  }

  private getBestVersionMatch(occurredEvent: any): ConfiguredEventVersion {
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
  }
}
