import { v4 as uuidv4 } from "uuid";

const Event = class {
  constructor({ name, version }) {
    this.id = uuidv4();
    this.occurredOn = new Date();
    this.name = name;
    this.version = version;
    // TODO: get correlationId
    this.correlationId = undefined;
    this.message = {};
  }
};

export { Event };
