import { DestinationProcessor } from "../../domain/services/destination-processor";
import { RulesEngine } from "../../infrastructure/json-rules-engine/rules-engine";
import { Repositories } from "./repositories";
import { LifecycleActivator } from "../../domain/services/lifecycle-activator";

const DomainServices = (domainEvents) => {
  const destinationProcessor = new DestinationProcessor(RulesEngine());
  const lifecycleActivator = new LifecycleActivator(Repositories.lifecycle, domainEvents);
  return {
    destinationProcessor,
    lifecycleActivator
  };
};

export { DomainServices };
