import { ConfiguredDomainEventHandler } from "../event-handlers/configured-domain-event-handler";
import { Repositories } from "./repositories";

const EventHandlers = (domainEvents, domainServices) => {
  const configuredDomainEventHandler = ConfiguredDomainEventHandler(
    domainEvents,
    Repositories.configuredEvent,
    domainServices.destinationProcessor,
    Repositories.lifecycle,
    Repositories.item);
  return {
    configuredDomainEvent: configuredDomainEventHandler
  };
};

export { EventHandlers };
