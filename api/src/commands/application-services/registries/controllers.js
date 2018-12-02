import { Repositories } from "./repositories";
import { Factories } from "./factories";
import { ConfiguredEventController } from "../controllers/configured-event-controller";
import { LifecycleController } from "../controllers/lifecycle-controller";

const Controllers = (app, domainEvents) => {
  const configuredEventController = ConfiguredEventController(
    app,
    domainEvents,
    Factories.configuredEvent,
    Repositories.configuredEvent);
  const lifecycleController = LifecycleController(
    app,
    domainEvents,
    Factories.lifecycle,
    Repositories.lifecycle);
  return {
    configuredEvent: configuredEventController,
    lifecycle: lifecycleController
  };
};

export { Controllers };
