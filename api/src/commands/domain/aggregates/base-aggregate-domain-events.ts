import { EventInterface } from "../events/event";

export class DomainEvents {
  public raisedEvents: EventInterface[];
  private subscriptions: any;

  constructor() {
    this.raisedEvents = [];
    this.subscriptions = {};
  }

  public async raise(event: EventInterface): Promise<void> {
    this.raisedEvents.push(event);
    if (this.subscriptions[event.name]) {
      for (const handler of this.subscriptions[event.name]) {
        await handler(event);
      }
    }
  }

  public listen(
    eventName: string,
    handler: (event: EventInterface) => Promise<void>
  ): void {
    if (!this.subscriptions[eventName]) {
      this.subscriptions[eventName] = [];
    }
    this.subscriptions[eventName].push(handler);
  }
}
