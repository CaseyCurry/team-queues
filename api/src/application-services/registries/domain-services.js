import { DestinationProcessor } from "../../domain/services/destination-processor";
import { RulesEngine } from "../../infrastructure/json-rules-engine/rules-engine";

const destinationProcessor = new DestinationProcessor(RulesEngine());

const DomainServices = {
  destinationProcessor
};

export { DomainServices };