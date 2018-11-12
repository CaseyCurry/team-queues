import { Repositories } from "./repositories";
import { Factories } from "./factories";
import { LifecycleController } from "../controllers/lifecycle-controller";
import { ConfiguredEventController } from "../controllers/configured-event-controller";

const Controllers = (app, domainEvents) => {
  const lifecycleController = LifecycleController(
    app,
    domainEvents,
    Factories.lifecycle,
    Repositories.lifecycle);
  const configuredEventController = ConfiguredEventController(
    app,
    domainEvents,
    Factories.configuredEvent,
    Repositories.configuredEvent);
  return {
    lifecycle: lifecycleController,
    configuredEvent: configuredEventController
  };
};

export { Controllers };