import { Event } from "./event";
import hash from "object-hash";

const TaggedAggregateEvent = class extends Event {
  constructor({ name, version, aggregate }) {
    super({ name, version });
    this.message.etag = hash.sha1(aggregate);
  }
};

export { TaggedAggregateEvent };
