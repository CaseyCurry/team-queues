import { DestinationProcessor } from "../../domain/services/destination-processor";
import { DomainEventFilter } from "../../domain/services/domain-event-filter";
import { RulesEngine } from "../../infrastructure/json-rules-engine/rules-engine";

const DomainServices = (domainEvents, clientNotifications) => {
  const destinationProcessor = DestinationProcessor(RulesEngine());
  const domainEventFilter = DomainEventFilter(
    domainEvents,
    clientNotifications
  );
  return {
    destinationProcessor,
    domainEventFilter
  };
};

export { DomainServices };
