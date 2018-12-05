import deepFreeze from "deep-freeze";
import { DestinationFactory } from "../factories/destination-factory";

const TriggeredDestination = class {
  constructor({ eventNames, destinations }) {
    const errorMessages = [];
    if (!eventNames || !Array.isArray(eventNames) || !eventNames.every((name) => typeof name === "string")) {
      errorMessages.push("The eventNames must be an array");
    }
    if (!destinations || !Array.isArray(destinations)) {
      errorMessages.push("The destinations must be an array");
    }
    if (errorMessages.length) {
      errorMessages.push(errorMessages);
    }
    this.eventNames = eventNames;
    this.destinations = destinations.map((destination) => DestinationFactory.create(destination));
    deepFreeze(this);
  }

  listensFor(eventName) {
    return this.eventNames.includes(eventName);
  }
};

export { TriggeredDestination };
