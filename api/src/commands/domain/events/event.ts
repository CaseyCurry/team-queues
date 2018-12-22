import { v4 as uuidv4 } from "uuid";

export interface EventInterface {
  id: string;
  occurredOn: Date;
  name: string;
  version: number;
  message: any;
}

export abstract class Event implements EventInterface {
  public id: string;
  public occurredOn: Date;
  public name: string;
  public version: number;
  public message: any;

  constructor({ name, version }: { name: string; version: number }) {
    this.id = uuidv4();
    this.occurredOn = new Date();
    this.name = name;
    this.version = version;
    // TODO: implement correlationId
    // this.correlationId = undefined;
    this.message = {};
  }
}
