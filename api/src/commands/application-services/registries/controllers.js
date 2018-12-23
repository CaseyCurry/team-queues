import { Repositories } from "./repositories";
import { ConfiguredEventController } from "../controllers/configured-event-controller";
import { LifecycleController } from "../controllers/lifecycle-controller";

const Controllers = (app, domainServices) => {
  const configuredEventController = ConfiguredEventController(
    app,
    domainServices.domainEventFilter,
    Repositories.configuredEvent
  );
  const lifecycleController = LifecycleController(
    app,
    domainServices.domainEventFilter,
    Repositories.lifecycle
  );
  return {
    configuredEvent: configuredEventController,
    lifecycle: lifecycleController
  };
};

export { Controllers };
