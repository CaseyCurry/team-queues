import { Lifecycle } from "../../domain/aggregates/lifecycle";
import { ConfiguredEvent } from "../../domain/aggregates/configured-event";

const Aggregates = {
  lifecycle: Lifecycle,
  configuredEvent: ConfiguredEvent
};

export { Aggregates };
