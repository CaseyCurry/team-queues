const DomainEvents = class {
  constructor() {
    this.raisedEvents = [];
    this.subscriptions = {};
  }

  async raise(event) {
    this.raisedEvents.push(event);
    if (this.subscriptions[event.name]) {
      for (const handler of this.subscriptions[event.name]) {
        await handler(event);
      }
    }
  }

  listen(eventName, handler) {
    if (!this.subscriptions[eventName]) {
      this.subscriptions[eventName] = [];
    }
    this.subscriptions[eventName].push(handler);
  }
};

const BaseAggregate = class {
  constructor() {
    /* Use defineProperty so that domainEvents can be set to unenumerable so
       it will not be serialized. */
    Object.defineProperty(this, "domainEvents", {
      value: new DomainEvents(),
      writable: false,
      enumerable: false
    });
  }
};

export { BaseAggregate };