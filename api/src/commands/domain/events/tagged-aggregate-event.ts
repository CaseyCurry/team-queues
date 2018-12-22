import { Event } from "./event";
import hash from "object-hash";
import { BaseAggregate } from "../aggregates/base-aggregate";

export abstract class TaggedAggregateEvent extends Event {
  constructor({
    name,
    version,
    aggregate
  }: {
    name: string;
    version: number;
    aggregate: BaseAggregate;
  }) {
    super({ name, version });
    this.message.etag = hash.sha1(aggregate);
  }
}
