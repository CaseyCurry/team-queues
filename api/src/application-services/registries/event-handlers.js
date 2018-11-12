import { ConfiguredDomainEventHandler } from "../event-handlers/configured-domain-event-handler";
import { Repositories } from "./repositories";
import { DomainServices } from "./domain-services";

const EventHandlers = (domainEvents) => {
  const configuredDomainEventHandler = ConfiguredDomainEventHandler(
    domainEvents,
    Repositories.configuredEvent,
    DomainServices.destinationProcessor,
    Repositories.lifecycle,
    Repositories.item);
  return {
    configuredDomainEvent: configuredDomainEventHandler
  };
};

export { EventHandlers };