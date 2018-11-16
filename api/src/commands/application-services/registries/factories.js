import { LifecycleFactory } from "../../domain/factories/lifecycle-factory";
import { ConfiguredEventFactory } from "../../domain/factories/configured-event-factory";

const Factories = {
  lifecycle: LifecycleFactory,
  configuredEvent: ConfiguredEventFactory
};

export { Factories };