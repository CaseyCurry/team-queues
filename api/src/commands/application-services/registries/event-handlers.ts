import { ConfiguredEventsHandler } from "../event-handlers/configured-events-handler";
import { ConfiguredEventModifiedHandler } from "../event-handlers/configured-event-modified-handler";
import { LifecycleVersionActivatedHandler } from "../event-handlers/lifecycle-version-activated-handler";
import { Repositories } from "./repositories";
import { DomainServices } from "./domain-services";
import { DomainEvents } from "../../infrastructure/kafka/domain-events";

export class EventHandlers {
  public configuredEvents: ConfiguredEventsHandler;
  public configuredEventModified: ConfiguredEventModifiedHandler;
  public lifecycleVersionActivated: LifecycleVersionActivatedHandler;

  constructor(
    domainEvents: DomainEvents,
    domainServices: DomainServices,
    repositories: Repositories
  ) {
    const configuredEventsHandler = new ConfiguredEventsHandler(
      domainEvents,
      domainServices.domainEventFilter,
      repositories.configuredEvent,
      domainServices.destinationProcessor,
      repositories.lifecycle,
      repositories.item
    );
    const configuredEventModifiedHandler = new ConfiguredEventModifiedHandler(
      domainEvents,
      configuredEventsHandler.reregister
    );
    const lifecycleVersionActivatedHandler = new LifecycleVersionActivatedHandler(
      domainEvents,
      configuredEventsHandler.reregister
    );
    this.configuredEvents = configuredEventsHandler;
    this.configuredEventModified = configuredEventModifiedHandler;
    this.lifecycleVersionActivated = lifecycleVersionActivatedHandler;
  }
}
