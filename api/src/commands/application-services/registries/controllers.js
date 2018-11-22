import { Repositories } from "./repositories";
import { Factories } from "./factories";
import { Aggregates } from "./aggregates";
import { ConfiguredEventController } from "../controllers/configured-event-controller";
import { LifecycleController } from "../controllers/lifecycle-controller";

const Controllers = (app, domainEvents, domainServices) => {
  const configuredEventController = ConfiguredEventController(
    app,
    domainEvents,
    Factories.configuredEvent,
    Repositories.configuredEvent);
  const lifecycleController = LifecycleController(
    app,
    domainEvents,
    Aggregates.lifecycle,
    Factories.lifecycle,
    Repositories.lifecycle,
    domainServices.lifecycleActivator);
  return {
    configuredEvent: configuredEventController,
    lifecycle: lifecycleController
  };
};

export { Controllers };
