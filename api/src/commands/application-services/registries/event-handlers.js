import { ConfiguredEventsHandler } from "../event-handlers/configured-events-handler";
import { ConfiguredEventModifiedHandler } from "../event-handlers/configured-event-modified-handler";
import { LifecycleVersionActivatedHandler } from "../event-handlers/lifecycle-version-activated-handler";
import { Repositories } from "./repositories";

const EventHandlers = (domainEvents, domainServices) => {
  const configuredEventsHandler = ConfiguredEventsHandler(
    domainEvents,
    domainServices.domainEventFilter,
    Repositories.configuredEvent,
    domainServices.destinationProcessor,
    Repositories.lifecycle,
    Repositories.item
  );
  const configuredEventModifiedHandler = ConfiguredEventModifiedHandler(
    domainEvents,
    configuredEventsHandler.reregister
  );
  const lifecycleVersionActivatedHandler = LifecycleVersionActivatedHandler(
    domainEvents,
    configuredEventsHandler.reregister
  );
  return {
    configuredEvents: configuredEventsHandler,
    configuredEventModified: configuredEventModifiedHandler,
    lifecycleVersionActivated: lifecycleVersionActivatedHandler
  };
};

export { EventHandlers };
