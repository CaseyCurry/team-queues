import { ConfiguredEvent } from "../aggregates/configured-event";

const ConfiguredEventFactory = {
  create: ({ name, versions }) => {
    const errorMessages = [];
    if (!name || typeof name !== "string") {
      errorMessages.push("The name must have a value and must be a string");
    }
    if (!versions || !Array.isArray(versions) || versions.length <= 0) {
      errorMessages.push("The versions must be an array have have one or more versions");
    }
    if (errorMessages.length) {
      throw new Error(errorMessages);
    }
    const configuredEvent = new ConfiguredEvent({ name });
    versions.forEach((version) => {
      configuredEvent.configureVersion(version);
    });
    return configuredEvent;
  }
};

export { ConfiguredEventFactory };