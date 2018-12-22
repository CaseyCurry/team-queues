import { DomainEvents } from "./base-aggregate-domain-events";

export abstract class BaseAggregate {
  public domainEvents: DomainEvents;

  constructor() {
    this.domainEvents = new DomainEvents();
  }

  // TODO: prove this avoids serialization of domainEvents
  public toJSON(): any {
    const obj: any = {};
    for (const key of Object.keys(this)) {
      if (key !== "domainEvents") {
        obj[key] = (this as any)[key];
      }
    }
    return obj;
  }
}
