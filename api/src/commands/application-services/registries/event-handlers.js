import { ConfiguredEventsHandler } from "../event-handlers/configured-events-handler";
import { ConfiguredEventModifiedHandler } from "../event-handlers/configured-event-modified-handler";
import { Repositories } from "./repositories";

const EventHandlers = (domainEvents, domainServices) => {
  const configuredEventsHandler = ConfiguredEventsHandler(
    domainEvents,
    Repositories.configuredEvent,
    domainServices.destinationProcessor,
    Repositories.lifecycle,
    Repositories.item);
  const configuredEventModifiedHandler = ConfiguredEventModifiedHandler(
    domainEvents,
    configuredEventsHandler.reregister
  );
  return {
    configuredEvents: configuredEventsHandler,
    configuredEventModified: configuredEventModifiedHandler
  };
};

export { EventHandlers };
