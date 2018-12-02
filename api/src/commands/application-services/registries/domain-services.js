import { DestinationProcessor } from "../../domain/services/destination-processor";
import { RulesEngine } from "../../infrastructure/json-rules-engine/rules-engine";

const DomainServices = () => {
  const destinationProcessor = new DestinationProcessor(RulesEngine());
  return {
    destinationProcessor
  };
};

export { DomainServices };
