import { DestinationProcessor } from "../../domain/services/destination-processor";
import { DomainEventFilter } from "../../domain/services/domain-event-filter";
import { RulesEngine } from "../../infrastructure/json-rules-engine/rules-engine";
import { ClientNotifications } from "../../infrastructure/socketio/client-notifications";
import { DomainEvents } from "../../infrastructure/kafka/domain-events";

export class DomainServices {
  public destinationProcessor: DestinationProcessor;
  public domainEventFilter: DomainEventFilter;

  constructor(
    domainEvents: DomainEvents,
    clientNotifications: ClientNotifications
  ) {
    this.destinationProcessor = new DestinationProcessor(new RulesEngine());
    this.domainEventFilter = new DomainEventFilter(
      domainEvents,
      clientNotifications
    );
  }
}
