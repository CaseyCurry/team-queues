import deepFreeze from "deep-freeze";
import { DestinationFactory } from "../factories/destination-factory";

const Trigger = class {
  constructor({ eventNames, destinations }) {
    if (!eventNames || !Array.isArray(eventNames) || !eventNames.every((name) => typeof name === "string")) {
      throw new Error("The eventNames must be an array");
    }
    if (!destinations || !Array.isArray(destinations)) {
      throw new Error("The destinations must be an array");
    }
    this.eventNames = eventNames;
    this.destinations = destinations.map((destination) => DestinationFactory.create(destination));
    deepFreeze(this);
  }

  listensFor(eventName) {
    return this.eventNames.includes(eventName);
  }
};

export { Trigger };