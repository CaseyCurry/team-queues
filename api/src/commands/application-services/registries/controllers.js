import { Repositories } from "./repositories";
import { Factories } from "./factories";
import { ConfiguredEventController } from "../controllers/configured-event-controller";
import { LifecycleController } from "../controllers/lifecycle-controller";

const Controllers = (app, domainServices) => {
  const configuredEventController = ConfiguredEventController(
    app,
    domainServices.domainEventFilter,
    Factories.configuredEvent,
    Repositories.configuredEvent);
  const lifecycleController = LifecycleController(
    app,
    domainServices.domainEventFilter,
    Factories.lifecycle,
    Repositories.lifecycle);
  return {
    configuredEvent: configuredEventController,
    lifecycle: lifecycleController
  };
};

export { Controllers };
